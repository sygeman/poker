export let restEndpoint = "http://localhost:3333/";

if (location.origin.indexOf("https") >= 0) {
  restEndpoint = `${location.origin}/`;
}

export let wsEndpoint = restEndpoint.replace("http", "ws");
