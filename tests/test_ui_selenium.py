"""Selenium UI tests for StockFlow WMS (Software Engineering project).

This drives the React frontend in a real browser and checks what the user
actually sees and clicks: the login form, the sidebar menu, page navigation,
search, and the "Add Product" flow.

Note: the frontend has its *own* client-side login (see
frontend/src/pages/LoginPage.jsx), so these tests do NOT need the Flask
backend. They only need the frontend dev server running.

Prerequisites
-------------
1. Install Selenium in the project venv:
       ./venv/bin/pip install "selenium>=4.6"
   (Selenium 4.6+ downloads the browser driver for you automatically.)

2. Start the frontend in another terminal:
       cd frontend
       npm run dev
   It prints a URL, usually http://localhost:5173

Run (from the project root)
---------------------------
    ./venv/bin/python tests/test_ui_selenium.py

    # Watch the browser instead of running headless:
    HEADLESS=0 ./venv/bin/python tests/test_ui_selenium.py

    # Point at a different URL:
    BASE_URL=http://localhost:4173 ./venv/bin/python tests/test_ui_selenium.py

Run a single test:
    ./venv/bin/python tests/test_ui_selenium.py TestLogin.test_admin_login_lands_on_dashboard
"""

import os
import unittest

from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait

BASE_URL = os.environ.get("BASE_URL", "http://localhost:5173")
HEADLESS = os.environ.get("HEADLESS", "1") != "0"
TIMEOUT = 10  # seconds to wait for elements to appear

ADMIN = ("admin", "123456")
CLERK = ("clerk", "123456")

ALL_MODULES = [
    "Dashboard", "Products", "Inventory", "Suppliers", "Customers",
    "Purchase Orders", "Sales Orders", "Stock Movement", "Warehouses",
    "Employees", "Reports", "Notifications", "Settings",
]
# Pages a Warehouse Clerk is allowed to open (App.jsx -> CLERK_PAGES)
CLERK_MODULES = ["Dashboard", "Products", "Inventory", "Stock Movement"]


class WmsUiTest(unittest.TestCase):
    """Base class: opens the browser and starts every test logged out."""

    def setUp(self):
        options = webdriver.ChromeOptions()
        if HEADLESS:
            options.add_argument("--headless=new")
        options.add_argument("--window-size=1440,900")
        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, TIMEOUT)

        try:
            self.driver.get(BASE_URL)
        except WebDriverException:
            self.driver.quit()
            self.skipTest(f"Could not reach {BASE_URL} - is 'npm run dev' running?")

        # The app stores the logged-in user in localStorage, so clear it and
        # reload to make sure every test begins at the login screen.
        self.driver.execute_script("window.localStorage.clear()")
        self.driver.refresh()
        self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "button.login-button")))

    def tearDown(self):
        try:
            self.driver.execute_script("window.localStorage.clear()")
        except WebDriverException:
            pass
        self.driver.quit()

    # -- helpers ----------------------------------------------------------

    def login(self, username, password):
        user_field = self.driver.find_element(By.CSS_SELECTOR, 'input[placeholder="Enter username"]')
        pass_field = self.driver.find_element(By.CSS_SELECTOR, 'input[placeholder="Enter password"]')
        user_field.clear()
        user_field.send_keys(username)
        pass_field.clear()
        pass_field.send_keys(password)
        self.driver.find_element(By.CSS_SELECTOR, "button.login-button").click()

    def header_title(self):
        """Title shown at the top right of the app (from Header.jsx)."""
        element = self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".top-header h1")))
        return element.text.strip()

    def sidebar_labels(self):
        items = self.driver.find_elements(By.CSS_SELECTOR, "button.nav-item")
        return [item.find_element(By.TAG_NAME, "span").text.strip() for item in items]

    def click_nav(self, label):
        for item in self.driver.find_elements(By.CSS_SELECTOR, "button.nav-item"):
            if item.find_element(By.TAG_NAME, "span").text.strip() == label:
                item.click()
                return
        self.fail(f"Sidebar item '{label}' was not found")

    def table_rows(self):
        return self.driver.find_elements(By.CSS_SELECTOR, "table tbody tr")

    def wait_for_rows(self, count):
        self.wait.until(lambda d: len(d.find_elements(By.CSS_SELECTOR, "table tbody tr")) == count)


class TestLogin(WmsUiTest):
    def test_login_page_is_shown(self):
        heading = self.driver.find_element(By.TAG_NAME, "h1").text.strip()
        self.assertEqual(heading, "Sign in to your account")

    def test_empty_fields_show_error(self):
        self.driver.find_element(By.CSS_SELECTOR, "button.login-button").click()
        error = self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".form-error")))
        self.assertIn("Please enter username and password", error.text)

    def test_wrong_password_shows_error(self):
        self.login("admin", "wrong-password")
        error = self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".form-error")))
        self.assertIn("Invalid username or password", error.text)

    def test_admin_login_lands_on_dashboard(self):
        self.login(*ADMIN)
        self.assertEqual(self.header_title(), "Dashboard")
        welcome = self.wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, ".dashboard-page h2"))).text
        self.assertIn("Good Morning", welcome)


class TestNavigation(WmsUiTest):
    def test_admin_sees_all_modules_in_sidebar(self):
        self.login(*ADMIN)
        self.assertEqual(self.sidebar_labels(), ALL_MODULES)

    def test_navigate_to_products_lists_all_rows(self):
        self.login(*ADMIN)
        self.click_nav("Products")
        self.assertEqual(self.header_title(), "Products")
        self.wait_for_rows(8)  # frontend mock data has 8 products
        self.assertIn("Wireless Mouse", self.driver.find_element(By.CSS_SELECTOR, "table").text)

    def test_product_search_filters_table(self):
        self.login(*ADMIN)
        self.click_nav("Products")
        self.wait_for_rows(8)

        search = self.driver.find_element(By.CSS_SELECTOR, 'input[placeholder="Search products..."]')
        search.send_keys("Wireless")
        self.wait_for_rows(1)
        self.assertIn("Wireless Mouse", self.driver.find_element(By.CSS_SELECTOR, "table").text)

        search.clear()
        search.send_keys("zzzz-no-match")
        self.wait.until(lambda d: "No products match your search" in d.find_element(By.CSS_SELECTOR, "table").text)


class TestRoleAccess(WmsUiTest):
    def test_clerk_sees_only_permitted_modules(self):
        self.login(*CLERK)
        self.assertEqual(self.header_title(), "Dashboard")
        self.assertEqual(self.sidebar_labels(), CLERK_MODULES)
        self.assertNotIn("Suppliers", self.sidebar_labels())


class TestAddProduct(WmsUiTest):
    def test_add_product_creates_new_row(self):
        self.login(*ADMIN)
        self.click_nav("Products")
        self.wait_for_rows(8)

        self.driver.find_element(
            By.XPATH, "//button[contains(@class,'primary-button')][contains(., 'Add Product')]").click()
        modal = self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".modal")))
        self.assertEqual(modal.get_attribute("aria-label"), "Add Product")

        def fill(label_text, value, tag="input"):
            field = modal.find_element(By.XPATH, f".//label[contains(., '{label_text}')]//{tag}")
            field.clear()
            field.send_keys(value)

        fill("Product Name", "Selenium Test Widget")
        fill("SKU", "SEL-TEST-001")
        Select(modal.find_element(By.XPATH, ".//label[contains(., 'Supplier')]//select")).select_by_visible_text("TechSource India")
        fill("Price", "100")
        fill("Quantity", "5")

        modal.find_element(By.XPATH, ".//button[@type='submit']").click()

        self.wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, ".modal")))
        self.wait_for_rows(9)
        self.assertIn("Selenium Test Widget", self.driver.find_element(By.CSS_SELECTOR, "table").text)


class TestLogout(WmsUiTest):
    def test_logout_returns_to_login(self):
        self.login(*ADMIN)
        self.assertEqual(self.header_title(), "Dashboard")
        self.driver.find_element(By.CSS_SELECTOR, "button.logout-button").click()
        self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "button.login-button")))


if __name__ == "__main__":
    print(f"Running UI tests against {BASE_URL}  (headless={HEADLESS})\n")
    unittest.main(verbosity=2)
