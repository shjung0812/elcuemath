import { mainServerURL } from "/model/utils/env.js"

export const intermediateCheckListConfirmExecution = async function(datatosend) {
    try {
        const queryString = new URLSearchParams(datatosend).toString();
        const url = mainServerURL + '/hana/whalse/intermediateproductinspection/checklistexecution?' + queryString;


        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({ 'data': parcelcodegroup })
        })

        if (!response.ok) {
            throw new Error('Network response is not ok')
        }
        const responseData  = await response.json();
        window.location.reload();
        // return responseData.madaeinfodata
    } catch (error) {
        throw error
    }


}