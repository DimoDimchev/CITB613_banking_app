import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions

# Dynamically parametrize 'browser_name' across tests that use it
def pytest_generate_tests(metafunc):
    if "browser_name" in metafunc.fixturenames:
        metafunc.parametrize("browser_name", ["chrome", "firefox"])

@pytest.fixture(scope="class")
def setup(request, browser_name):
    if browser_name == "chrome":
        options = ChromeOptions()
        driver = webdriver.Chrome(options=options)
    elif browser_name == "firefox":
        options = FirefoxOptions()
        driver = webdriver.Firefox(options=options)
    else:
        raise ValueError(f"Unsupported browser: {browser_name}")

    driver.maximize_window()
    request.cls.driver = driver
    yield
    driver.quit()
