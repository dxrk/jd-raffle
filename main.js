const request = require('request-promise-native');
const faker = require('faker');
const signale = require('signale');
signale.config({
  displayDate: true,
  displayTimestamp: true
})
const cluster = require('cluster');


// Change this before continuing
const catchall = "yourcatchall.com"
const sportsUrl = "https://rafflelink.com" // From reporting.jdsports.co.uk
const proxy = 'http://username:password@hostUrl:port' // Required
// Can change/append but not recommended
const sizes = [3.5, 4, 4.5, 5, 5.5, 6, 6.5]
const compAddy4 = ['Buckinghamshire', 'Cambridgeshire', 'Cheshire', 'Cleveland', 'Cornwall', 'Cumbria', 'Derbyshire', 'Devon', 'Dorset', 'Durham', 'East Sussex', 'Essex', 'Gloucestershire', 'Greater London', 'Greater Manchester', 'Hampshire']

const enter = () => {
  const first = faker.name.firstName()
  const last = faker.name.firstName()
  const phoneNum = faker.phone.phoneNumber('##########')
  const postCode = faker.address.zipCode('DD##+#SD');
  const email = `${first}${last}%40${catchall}`
  const size = sizes[Math.floor(Math.random() * sizes.length)]
  const comp4 = compAddy4[Math.floor(Math.random() * compAddy4.length)]
  request({
    method: 'POST',
    url: sportsUrl,
    body: `comp_firstname=${first}&comp_lastname=${last}&comp_email=${email}&paypal_email=${email}&comp_countrycode=%2B44&comp_mobile_end=${phoneNum}&comp_mobile=%2B44${phoneNum}&colorways_size=${`Womens+${size}`}&comp_address1=${encodeURI(faker.address.streetAddress()).split("%20").join("+")}&comp_address2=3232323&comp_address3=${encodeURI(faker.address.city()).split("%20").join("+")}&comp_address4=${encodeURI(comp4).split("%20").join("+")}&comp_postcode=${postCode}&emailhold=on&emailpermit=1&sms_optout=1&submit=ENTER+NOW&comp_yeezy_1=1`,
    proxy: proxy,
    headers: {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "cross-site",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1"
    },
    json: true,
    gzip: true,
    mode: 'cors',
    credentials: 'include'
  }).then(() => {
    signale.success(`Entered using ${email.replace('%40', '@')} in Size ${size}`)
  }).catch(signale.error)
}


if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  const numCPUs = require('os').cpus().length;

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

} else {
  setInterval(() => {
    enter()
  }, 200)
}


