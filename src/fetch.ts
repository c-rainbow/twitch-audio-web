

export async function fetchContent(url: string) {
    if(!url) return null;
    const response = await fetch(url);
    // TODO: Check if the status if ok
    const respText = await response.text();
    return respText;
}


export async function fetchJson(url: string) {
    const respText = await fetchContent(url);
    if(respText) {
        try {
            const respJson = JSON.parse(respText);
            return respJson;
        }
        catch(err) {
            console.log("Response could not be parsed to JSON: " + respText);
        }
    }
    return null;
}