var Horseman = require('node-horseman');
var cheerio = require('cheerio');
var _ = require('lodash');
var credentials = require('./credentials.js');

var horseman = new Horseman();

horseman
  .userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0")
  .viewport(1600, 900)
  .open('https://portalpacjenta.luxmed.pl/PatientPortal/Account/LogOn')
  .type('#Login', credentials.username)
  .type('#TempPassword', credentials.password)
  .keyboardEvent("keypress",16777221)
  .waitForNextPage()
  .click('#reserveBoxcontentDiv > form > div.fields > div:nth-child(1) > div > div > div._select.widget.undefined') //Wybierz miasto
  .click('#__selectOptions > li[data-value=5]') //Wroc?aw
  .waitForNextPage()
  .click('#reserveBoxcontentDiv > form > div.fields > div:nth-child(3) > div > div > div._select.widget.undefined') //Wybierz wizyte lub badanie
  .html('#__selectOptions')
  .then(function(html){
    var $ = cheerio.load(html);
    var specialistCode = $('li:contains("stomatologa"):not(:contains("hirurga")):not(:contains("dzieci"))').first().attr('data-value') ; //Stomatolog
    specialistCode = 4502; //tmp
    return horseman.click('#__selectOptions > li[data-value='+ specialistCode +']')//Umowienie wizyty u 6621-stomatologa
  })
  .waitForNextPage()
  .click('#reserveBoxcontentDiv > form > div.buttons > input') //Szukaj
  .waitForNextPage()
  .html('#content > div.full > ul.tableList') //Lista dostepnych wizyt
  .then(function(html){
    var $ = cheerio.load(html);
    $('li').each(function(i, elem){
      console.log( $(elem).find('.title').text() ); //Dostepne dni
    });
  })

  // Uncomment for make a reservation
  //.click('#content > div.full > ul > li:nth-child(1) > div.content > table > tbody > tr:nth-child(1) > td.hours > div > a')
  //.waitForNextPage() //Popoup
  //.click('#cbAccept') //Akceptuje
  //.click('#okButton') //Zarezerwuj wizyte
  .screenshot('test.png')
  .close();



'https://portalpacjenta.luxmed.pl/PatientPortal/Account/LogOut'