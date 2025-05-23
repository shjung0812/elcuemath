
'use strict';

require('dotenv').config({ path: require('path').resolve(__dirname, '../..', '.env') });
const {Content} = require('../models')
async function sync(){
    // await Content.sync();

}

sync()
