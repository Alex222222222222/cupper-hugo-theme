// get the view-counter-params div
var viewCounterParams = document.getElementById("view-counter-params");
// get the attributes of the div
var baseURL = viewCounterParams.getAttribute("baseURL");
var enable = viewCounterParams.getAttribute("enable");
var password = viewCounterParams.getAttribute("password");
var username = viewCounterParams.getAttribute("username");

// if the view counter is enabled
if (enable == "true") {
    // get the current page base url
    var url_new = window.location.protocol + "//" + window.location.host + "/"
    url_new = encodeURIComponent(url_new);
    // get the current page path
    var path = window.location.pathname;
    path = encodeURIComponent(path);
    var pass = btoa(username + ":" + password)

    // use fetch to send a request to the view counter server
    const resp = await fetch(baseURL+"?siteBase="+url_new+"&sitePath="+path, {
			method: 'GET',
			headers: {
				'Authorization': 'Basic ' + btoa('blog:asdfghjk'),
				},
		});
    // get the response
    const data = await resp.json();
    // get the view count
    var site_view_all = data["site_view_all"];
    // get the view count of the current page
    var site_base_view_all = data["site_base_view_all"];
    // get the view count of the current page path
    var site_1m_view = data["site_1m_view"];

    var total_views = document.getElementById("total_views");
    var page_views = document.getElementById("page_views");
    var month_views = document.getElementById("month_views");

    total_views.innerHTML = site_base_view_all;
    page_views.innerHTML = site_view_all;
    month_views.innerHTML = site_1m_view;

}