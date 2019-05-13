module.exports = {
    cardById,
    addUser,
    allUsers,
    userByUserName,
    userById,
    update,
    _delete,
    getRandomCard,
    validate1,
    validate2



};
//Mongodb
const Mongo = require('mongodb');
const uri = "mongodb://127.0.0.1:27017";
var client = new Mongo.MongoClient(uri, { useNewUrlParser: true });
//END mongodb
function addUser(user) {
    return new Promise(resolve => {
        client.connect((err) => {
            var collection = client.db("gameDB").collection("users");
            collection.insertOne(user);
            resolve();
        });
    });
}
function allUsers() {
    return new Promise(resolve => {
        client.connect(async (err) => {
            console.log('get users')
            var collection = client.db("sonatDB").collection("users");
            var users = await collection.find({}).toArray();
            resolve(users);
        });
    });
}

function userByUserName(userName) {
    return new Promise(resolve => {
        client.connect(async (err) => {
            var collection = client.db("sonatDB").collection("users");
            // collection.find({}).toArray().then(value => {
            //    users = value;
            //});
            var user = await collection.findOne({ userName: userName });
            resolve(user);
        });
    });
}
async function userById(id) {
    return new Promise(resolve => {
        client.connect(async (err) => {
            var collection = client.db("sonatDB").collection("users");
            // collection.find({}).toArray().then(value => {
            //    users = value;
            //});
            var user = await collection.findOne({ _id: new Mongo.ObjectID(id) });
            resolve(user);
        });
    });
}
function update(id, userParam) {
    return new Promise(async resolve => {
        
        var user = await userById(id);
        console.log(user)
        if (!user) throw 'User not found';
        console.log('dfkj')
        console.log(user.userName !== userParam.userName && await userByUserName(userParam.userName))

        if (user.userName !== userParam.userName && await userByUserName(userParam.userName )) {
            throw 'Username "' + userParam.username + '" is already taken';
        }
        // hash password if it was entered
        if (userParam.password) {
           // userParam.hash = bcrypt.hashSync(userParam.password, 10);
        }
        // copy userParam properties to user
        Object.assign(user, userParam);
        client.connect(async (err) => {
             collection = await client.db("sonatDB").collection("users")
                 .update({ _id: new Mongo.ObjectID(id) }, user);
            
            resolve();
        });
    });
}

function _delete (id) {
    return new Promise(resolve => {
        client.connect(async (err) => {
            await client.db("sonatDB").collection("users")
                .deleteOne({ id: id });

            resolve();
        });
    });
}
function collectionCount(collectionName) {
    return new Promise(resolve => {
        client.connect(async (err) => {
            var count = await client.db('gameDB').collection(collectionName)
                .deleteOne({ id:id });

            resolve(count);
        });
    });
}
async function getRandomCard(collectionName, cardsInUse,cardType) {
    var cardsIds = [];
    for (var i = 0; i < cardsInUse.length; i++) {
        if (cardsInUse[i].type==cardType)
        cardsIds.push(cardsInUse[i].cardId)
    }
    
    return new Promise(resolve => {
        client.connect(async (err) => {
            console.log(cardsIds)
            var list = await client.db('gameDB').collection(collectionName)
                .find({ id: { $nin: cardsIds } }).toArray();
            //console.log(list);
            var i = randomIntInc(0, list.length - 1);
            resolve(list[i]);
        });
    });
}
async function cardById(collectionName, id) {
    return new Promise(resolve => {
        client.connect(async (err) => {
            var card = await client.db('gameDB').collection(collectionName)
                .findOne({ id: { $in: [id] } });
            //console.log(list);
            resolve(card);
        });
    });
}
function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low)
}

async function validate1(playerId,cardsInUse,cardIndex) {
    return new Promise(resolve => {
        client.connect(async (err) => {
            var playerCards  = cardsInUse.filter((x)=> x.playerId==playerId); 
            
            console.log(playerCards);
        var scen = await client.db('gameDB').collection('scenareo').findOne({id:playerCards[0].cardId});
        console.log(scen);
        var risk1 = await client.db('gameDB').collection('risks').findOne({ $and:[{id:playerCards[cardIndex].cardId},{id:{$in:scen.riskid}}]});
        console.log(risk1);
        if(!risk1)
        resolve( false)
        else
        {
        resolve( true);
        }
        });
    });
}
async function validate2(playerId,cardsInUse) {
    return new Promise(resolve => {
        client.connect(async (err) => {
            var playerCards  = cardsInUse.filter((x)=> x.playerId==playerId); 
            var index = playerCards.findIndex(x=>x.id==-1);
            var riskIndex; 
            if(index==1) {
                riskIndex = 2;
            } else {
                riskIndex = 1; 
            }
    var risk1 = await client.db('gameDB').collection('risks').findOne({id:playerCards[riskIndex].cardId});
    if(!risk1)
    resolve(false) 
    var tool1 = await client.db('gameDB').collection('tools').findOne({$and:[{id:playerCards[3].cardId},
                            {id:{$in:risk1.toolid}}]});
    if(!tool1)
    resolve(false) 
    else
    {
    var tool2 = await client.db('gameDB').collection('tools').findOne({$and:[{id:playerCards[4].cardId},
        {id:{$in:risk1.toolid}}]});
    if(!tool2)
    return resolve(false);
    else
    return resolve(true);
    }
        });
    });
}
