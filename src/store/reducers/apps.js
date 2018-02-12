
const initialState = {
    apps : [
        {
            isDefault: true,
            authClient: {
                clientName: "Bilirubin Chart",
                clientId: "bilirubin_chart",
                redirectUri: "https://bilirubin-risk-chart-test.hspconsortium.org/index.html"
            },
            appUri: "https://bilirubin-risk-chart-test.hspconsortium.org/",
            launchUri: "https://bilirubin-risk-chart-test.hspconsortium.org/launch.html",
            logoUri: "https://content.hspconsortium.org/images/bilirubin/logo/bilirubin.png"
        },
        {
            isDefault: true,
            authClient: {
                clientName: "My Web App",
                clientId: "my_web_app",
                redirectUri: "http://localhost:8000/fhir-app/"
            },
            launchUri: "http://localhost:8000/fhir-app/launch.html",
            logoUri: "https://content.hspconsortium.org/images/my-web-app/logo/my.png"
        },
        {
            isDefault: true,
            authClient: {
                clientName: "CDS Hooks Sandbox",
                clientId: "48163c5e-88b5-4cb3-92d3-23b800caa927",
                redirectUri: "http://sandbox.cds-hooks.org/launch.html"
            },
            appUri: "http://sandbox.cds-hooks.org/",
            launchUri: "http://sandbox.cds-hooks.org/launch.html",
            logoUri: "https://content.hspconsortium.org/images/cds-hooks-sandbox/logo/CdsHooks.png"
        }
    ]
};


const reducer = (state = initialState, action) => {

    switch (action.type) {
        default: return state;
    }

};

export default reducer;