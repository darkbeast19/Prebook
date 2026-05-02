const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set a typical viewport
    await page.setViewport({ width: 1536, height: 730 });

    const url = "https://preview--vale-voyage-hub.lovable.app/?__lovable_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWtqbzB0eTg1ME5JVFlnUjB6Z3RLb0xFbW5DMyIsInByb2plY3RfaWQiOiI4ZDkzODAwYS00YzEyLTQyOTctOGI0My1iMDAzZmM1ODY1MTIiLCJhY2Nlc3NfdHlwZSI6InByb2plY3QiLCJpc3MiOiJsb3ZhYmxlLWFwaSIsInN1YiI6IjhkOTM4MDBhLTRjMTItNDI5Ny04YjQzLWIwMDNmYzU4NjUxMiIsImF1ZCI6WyJsb3ZhYmxlLWFwcCJdLCJleHAiOjE3NzgwNDM3NDAsIm5iZiI6MTc3NzQzODk0MCwiaWF0IjoxNzc3NDM4OTQwfQ.YefTsuqlC7vEBI77DI02qkOuH243oeFkWHEiUXpBdt69UcsqRkzZjQt_oZ02CnZQe5kx6A5qZyeLpIKCoA5zE3v8erxJcxDX5iqcSWhKLdLkMoxBs0LQCgKS5s1FqCNidRLb_wW8QZBJUAUDxMEM_FsVvyzrTBFNe_oPXev1dUXkfHRyyQfyaKR_t5rosKkQ5GUS6KLz9SYHyJegbd53RyhPm9-DM9uu5wu1js2CDVDseUWKf8FWnrrint0A6K3CQMdHRDG2qWxIVvIE7zvaOLXOgETXehI7PIxnA7LwcBIpmOHE22yASy6O7ahnsy4W8bA8Ap9IK_hXs2GOwkd8GQiyypDGFFF123ND7UNWxXOuapOuW1Wwgqq-h3ZuNWcatc9J_3GTJYWgeKIat9inkdZPN0exolJ1f3r9Dk5zv2yHVWhwrmwC6aHriQiyiUESEPRlF7Vq30oggXvZGMEw7oMWwvbonRprFmApog6bO5xBWwTT0K74yOioVtRDxgtobSP5uQgtE6B4E-gK6D3tTW9W-prGXLHN9z9aUr5tbiEHgW4xvt4SLJj3e467GV7RQxgbRpQMi0nlqZlDinvGyBFMUhufyqU8qhaX-OzUkndANWPLCsLO2fK943Y2KE5QOBxySvXT49cWb2t9QKVU_yKTOvcaIBOD6aj1mNFJtfc";
    
    console.log("Navigating to URL...");
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    
    await new Promise(r => setTimeout(r, 5000));
    
    console.log("Extracting HTML...");
    const html = await page.evaluate(() => {
        // Remove scripts to avoid execution
        document.querySelectorAll('script').forEach(s => s.remove());
        return document.documentElement.outerHTML;
    });
    
    fs.writeFileSync('index.html', `<!DOCTYPE html>\n${html}`);
    
    console.log("Successfully saved exact HTML to index.html");
    await browser.close();
})();
