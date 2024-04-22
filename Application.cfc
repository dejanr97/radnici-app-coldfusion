component {

    this.name = "radnici-app";
    this.datasource = "radnici_db";
    this.sessionManagement = true;
    this.applicationTimeout = createTimeSpan(0,2,0,0);

    function onApplicationStart() {
        application.radniciFunkcije = createObject("component", "radnici-funkcije");
    }

    function onSessionStart() {
    session.language = "english";
    session.theme = "light";
}
    function onMissingTemplate(required string targetPage) {
        location(url="index.html", addtoken="false");
    }

}
