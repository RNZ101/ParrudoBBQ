from pathlib import Path
from urllib.parse import urlparse, parse_qs
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).parent.resolve()
OUT = ROOT / 'verification'
OUT.mkdir(exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe', headless=True)
    page = browser.new_page(reduced_motion='reduce')
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('console', lambda message: errors.append(message.text) if message.type == 'error' else None)
    results = []
    for width in [375, 430, 768, 1024, 1440]:
        page.set_viewport_size({'width': width, 'height': 900})
        page.goto((ROOT / 'index.html').as_uri())
        page.wait_for_load_state('load')
        assert page.locator('.product-card:visible').count() == 10
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Overflow {width}'
        for category, count in [('burgers', 3), ('bbq', 3), ('combos', 1), ('acompanhamentos', 2), ('bebidas', 1), ('todos', 10)]:
            page.locator(f'[data-category="{category}"].filter').click()
            assert page.locator('.product-card:visible').count() == count
        if width <= 900:
            page.locator('.menu-toggle').click()
            assert page.locator('#navigation').is_visible()
            assert page.locator('.menu-toggle').get_attribute('aria-expanded') == 'true'
            page.keyboard.press('Escape')
            assert not page.locator('#navigation').is_visible()
            page.locator('.menu-toggle').click()
            page.locator('#navigation a[href="#sobre"]').click()
            assert not page.locator('#navigation').is_visible()
            assert page.evaluate('location.hash') == '#sobre'
        for anchor in page.locator('a[href^="#"]').all():
            target = anchor.get_attribute('href')
            assert page.locator(target).count() > 0, target
        for anchor in page.locator('a[href*="wa.me"]').all():
            url = urlparse(anchor.get_attribute('href'))
            assert url.path == '/5522997343358'
            assert parse_qs(url.query).get('text')
            if 'product-order' in (anchor.get_attribute('class') or ''):
                assert 'site demonstrativo' in parse_qs(url.query)['text'][0]
        for image in page.locator('img').all():
            image.scroll_into_view_if_needed()
            assert image.evaluate('(img) => img.complete && img.naturalWidth > 0')
        page.evaluate('window.scrollTo(0,0)')
        page.screenshot(path=str(OUT / f'site-{width}.png'), full_page=True)
        results.append({'width': width, 'overflow': False, 'filters': 'passed', 'links': 'passed', 'mobile_menu': 'passed' if width <= 900 else 'n/a'})
    assert not errors, errors
    browser.close()
    (OUT / 'results.json').write_text(json.dumps({'viewports': results, 'console_errors': errors}, indent=2), encoding='utf-8')
    print(json.dumps(results))
