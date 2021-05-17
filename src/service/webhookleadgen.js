const bizSdk = require('facebook-nodejs-business-sdk');
const Lead = bizSdk.Lead;

const app_secret = process.env.APP_SECRET_FACE;
const app_id = process.env.APP_IP_FACE;

const debugads = (access_tokenn) => {

    const api = bizSdk.FacebookAdsApi.init(access_tokenn);
    const showDebugingInfo = true; // Setting this to true shows more debugging info.
    if (showDebugingInfo) {
        api.setDebug(true);
    }

}

/**
 *
 * obtener data del formulario de facebook
 * apiCallResult
 * @param string id_leadgenn
 * 
 */
const apiCallResult = async(id_leadgenn) => {

    console.log("---------------------------");

    let fields, params, get_code;
    get_code = {};
    fields = [];
    params = {};
    return get_code = await (new Lead(id_leadgenn)).get(
        fields,
        params
    );
    // console.log((get_code.field_data));
    /*
    if (showDebugingInfo) {
        console.log('Data:' + JSON.stringify(data));
    }
    */
};



// logApiCallResult('sample_code api call complete.', get_code);
/*
const accessToken = 'EAACFYeZCAYZCIBAOpU54N1M9czJP88PJEZCdaERAjoZAOXgGEFS2O6vPmnMK2Tn3edjdm5RzR4UFU6RRu2eR6Hlhp2cISHL84FOEXz1EwGqvwlvBDZCmd7V3aj26UCwUwNclbzDy59QVzaaYk6Q4WnAIbhSGTRoPHJBSuh1IywwZDZD';
const accountId = 'act_10157839963480392';

const FacebookAdsApi = bizSdk.FacebookAdsApi.init(accessToken);
const AdAccount = bizSdk.AdAccount;
const Campaign = bizSdk.Campaign;

const account = new AdAccount(accountId);
var campaigns;

account.read([AdAccount.Fields.name])
    .then((account) => {
        return account.getCampaigns([Campaign.Fields.name, Campaign.Fields.account_id], { limit: 10 }) // fields array and params
    })
    .then((result) => {
        campaigns = result
        campaigns.forEach((campaign) => console.log(campaign.name))
    }).catch(console.error);
*/
module.exports = {
    apiCallResult: apiCallResult,
    debugads: debugads,
    // id_leadgen: id_leadgen,
    // access_token: access_token // del user
}