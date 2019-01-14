import { HomePagePo } from './PageObjects/home.po';
import * as WebRequest from 'web-request';
import Config from '../../config.secret';

import {SignupFormPo} from './PageObjects/signup-form.po';
const path = require('path');

describe('workspace-project App', () => {
    let homePage: HomePagePo;
    let signupPage: SignupFormPo;

    function getRandomString() {
        let string = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 25; i++) {
            string += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return string;
    }

    beforeEach(() => {
        homePage = new HomePagePo();
        signupPage = new SignupFormPo();
    });


    afterEach(async () => {
        const result = await WebRequest.get(Config.apiUrl + 'reports/cleanup');
        const result_2 =  await WebRequest.get(Config.apiUrl + 'users/cleanup');

        // console.log(result.content);
    });

    it('should check for confirm popUp is not opened if title is missing', async () => {
        await homePage.navigateTo();
        const reportMapPage = await homePage.doCorrectLogin('indirizzo@email.com', 'password');

        const form = await reportMapPage.clickAddReportLogged();

        // TODO set location: via Dodecaneso 35

        await form.writeTitle('');
        await form.writeDescription('Test');
        await form.clickConfirmButton();

        expect(await form.isConfirmPopUpOpened()).toBe(false);
    });

    it('should check for confirm popUp is not opened if description is missing', async () => {
        await homePage.navigateTo();
        const reportMapPage = await homePage.doCorrectLogin('indirizzo@email.com', 'password');

        const form = await reportMapPage.clickAddReportLogged();
        // TODO set location: via Dodecaneso 35

        await form.writeTitle('Test');
        await form.writeDescription('');
        await form.clickConfirmButton();

        expect(await form.isConfirmPopUpOpened()).toBe(false);
    });

    it('should display a message when adding a new report', async () => {
        await homePage.navigateTo();
        const reportMapPage = await homePage.doCorrectLogin('indirizzo@email.com', 'password');

        const form = await reportMapPage.clickAddReportLogged();

        await form.writeTitle('Test');
        await form.writeDescription('Test');

        const popup = await form.submitForm();

        expect(await popup.getMessageText()).toEqual('Segnalazione aggiunta!');
    });

    it ('should appear particular existing report in list', async() => {
        await homePage.navigateTo();
        const reportMapPage = await homePage.doCorrectLogin('indirizzo@email.com', 'password');

        const reportTitle = await reportMapPage.getTitleLastListElement();
        const reportDescription = await reportMapPage.getDescriptionLastListElement();

        expect(await reportTitle).toEqual('divano abbandonato');
        expect(await reportDescription).toEqual('fortunatamente e` molto comodo!');
    });

    it ('should appear popup for single report view, when i click on list element', async() => {
        await homePage.navigateTo();
        const reportMapPage = await homePage.doCorrectLogin('indirizzo@email.com', 'password');

        const reportTitle = await reportMapPage.getTitleFirstListElement();
        const reportDescription = await reportMapPage.getDescriptionFirstListElement();

        const singleReportView = await reportMapPage.openFirstListElement();

        const modalTitle = await singleReportView.getTitle();
        const modalDescr = await singleReportView.getDescription();

        expect(await reportTitle).toEqual(await modalTitle);
        expect(await reportDescription).toEqual(await modalDescr);
    });

    it ('should see a report in the list that i have just added', async() => {
        await homePage.navigateTo();
        let reportMapPage = await homePage.doCorrectLogin('indirizzo@email.com', 'password');

        const form = await reportMapPage.clickAddReportLogged();

        const randomTitle = getRandomString();

        await form.writeTitle(randomTitle);
        await form.writeDescription('Test');

        const popup = await form.submitForm();

        await popup.closePopup();

        await homePage.navigateTo();
        reportMapPage = await homePage.goToDemo();

        // check that string is present in list
        const reportTitle = await reportMapPage.getMyReportTitle(randomTitle);
        const reportDescription = await reportMapPage.getMyReportDescription('Test');

        expect(await reportTitle).toEqual(randomTitle);
        expect(await reportDescription).toEqual('Test');

    });

    it('should display an error message when adding a url too big', async () => {
        await homePage.navigateTo();
        const reportMapPage = await homePage.doCorrectLogin('indirizzo@email.com', 'password');

        const form = await reportMapPage.clickAddReportLogged();

        await form.writeTitle('Test');
        await form.writeDescription('Test');
        const fileToUpload = '../imgTest/big_img.jpg',
            absolutePath = path.resolve(__dirname, fileToUpload);
        await form.uploadPitcure(absolutePath);

        const popup = form.getPopupError();

        expect(await popup.getMessageText()).toEqual('Immagine troppo grande.');
    });

    it('should display an error message when adding a file that is not a image', async () => {
        await homePage.navigateTo();
        const reportMapPage = await homePage.doCorrectLogin('indirizzo@email.com', 'password');

        const form = await reportMapPage.clickAddReportLogged();

        await form.writeTitle('Test');
        await form.writeDescription('Test');
        const fileToUpload = '../imgTest/not_a_image.txt',
            absolutePath = path.resolve(__dirname, fileToUpload);
        await form.uploadPitcure(absolutePath);

        const popup = form.getPopupError();

        expect(await popup.getMessageText()).toEqual('Formato immagine non corretto.');
    });

    it('should open the map demo page when clicking on demo button', async () => {
        await homePage.navigateTo();
        const reportMapPage = await homePage.goToDemo();

        expect(await reportMapPage.isMapPresent()).toBe(true);
    });

    it('should login when providing correct credentials', async () => {
        await homePage.navigateTo();
        const reportMapPage = await homePage.doCorrectLogin('indirizzo@email.com', 'password');

        expect(await reportMapPage.isProfileButtonPresent()).toBe(true);
    });

    it('should not login and display an error message when providing wrong email', async () => {
        await homePage.navigateTo();
        const popup = await homePage.doWrongLogin('wrong@email.com', 'password');
        expect(await popup.getMessageText()).toEqual('Email e/o password errati');
    });

    it('should not login and display an error message when providing wrong password', async () => {
        await homePage.navigateTo();
        const popup = await homePage.doWrongLogin('indirizzo@email.com', 'wrongpassword');
        expect(await popup.getMessageText()).toEqual('Email e/o password errati');
    });

    it('should signup to website when providing correct parameters and then be able to login', async () =>  {
        const email = 'test@test.com';
        const password = 'password1';

        await signupPage.navigateTo();
        await signupPage.compileSignupForm('ABCDEF00A99A000Z', email, password, password);
        await signupPage.acceptPrivacy();

        const popup = await signupPage.clickOnSignup();

        expect(await popup.getMessageText()).toEqual('Registrazione effettuata con successo, effettua il login in alto a destra');

        await homePage.navigateTo();
        const reportMapPage = await homePage.doCorrectLogin(email, password);

        expect(await reportMapPage.isProfileButtonPresent()).toBe(true);

    });

    it('should signup to website when providing correct parameters and then be able to login', async () =>  {
        const email = 'test@test.com';
        const password = 'password1';

        await signupPage.navigateTo();
        await signupPage.compileSignupForm('ABCDEF00A99A000Z', email, password, password);
        await signupPage.acceptPrivacy();

        const popup = await signupPage.clickOnSignup();

        expect(await popup.getMessageText()).toEqual('Registrazione effettuata con successo, effettua il login in alto a destra');

        await homePage.navigateTo();
        const reportMapPage = await homePage.doCorrectLogin(email, password);

        expect(await reportMapPage.isProfileButtonPresent()).toBe(true);

    });

    it ('should give error when trying to signup with already existing email', async() => {

        /* First registration */
        const email = 'test@test.com';
        const password = 'password1';
        let SSN = 'ABCDEF00A99A000Z';

        await signupPage.navigateTo();
        await signupPage.compileSignupForm(SSN, email, password, password);
        await signupPage.acceptPrivacy();

        let popup = await signupPage.clickOnSignup();

        expect(await popup.getMessageText()).toEqual('Registrazione effettuata con successo, effettua il login in alto a destra');

        /* Second registration  */
        SSN = 'ABCDEF00A99A000U';
        await signupPage.navigateTo();
        await signupPage.compileSignupForm(SSN, email, password, password);
        await signupPage.acceptPrivacy();
        popup = await signupPage.clickOnSignup();
        expect(await popup.getMessageText()).toEqual('Utente o codice fiscale già registrato');

    });


    it ('should give error when trying to signup with already existing SSN', async() => {

        /* First registration */
        let email = 'test@test.com';
        const password = 'password1';
        const SSN = 'ABCDEF00A99A000Z';

        await signupPage.navigateTo();
        await signupPage.compileSignupForm(SSN, email, password, password);
        await signupPage.acceptPrivacy();

        let popup = await signupPage.clickOnSignup();

        expect(await popup.getMessageText()).toEqual('Registrazione effettuata con successo, effettua il login in alto a destra');

        /* third registration  */
        email =  'test2@test.com';
        await signupPage.navigateTo();
        await signupPage.compileSignupForm(SSN, email, password, password);
        await signupPage.acceptPrivacy();
        popup = await signupPage.clickOnSignup();
        expect(await popup.getMessageText()).toEqual('Utente o codice fiscale già registrato');
    });

    it ('should give error when trying to signup password and confirmation are different', async() => {
        /* First registration */
        const email = 'test@test.com';
        const password = 'password1';
        const confirm_password = 'password2';
        const SSN = 'ABCDEF00A99A000Z';
        await signupPage.navigateTo();
        await signupPage.compileSignupForm(SSN, email, password, confirm_password);

        await signupPage.acceptPrivacy();
        await signupPage.clickOnSignup();

        expect(await signupPage.getErrorConfirmationPassword()).toEqual('Le password non combaciano.');
    });

    it ('should give error when trying to signup with password shorter then 8 chars', async() => {
        /* First registration */
        const email = 'test@test.com';
        const password = 'passw';
        const SSN = 'ABCDEF00A99A000Z';

        await signupPage.navigateTo();
        await signupPage.compileSignupForm(SSN, email, password, password);
        await signupPage.acceptPrivacy();
        await signupPage.clickOnSignup();

        expect(await signupPage.getErrorLengthPassword()).toEqual('Lunghezza minima: 8 caratteri.');
    });

    it ('should redirect to homepage after logout, be able to login, not able to view profile', async () => {
        await homePage.navigateTo();

        const reportMapPage = await homePage.doCorrectLogin('indirizzo@email.com', 'password');
        const profilePage = await reportMapPage.clickProfileButton();
        const homePageNew = await profilePage.clickLogout();

        expect(homePageNew.isProfileButtonPresent()).toEqual(false);
        expect(homePageNew.isLoginButtonPresent()).toEqual(true);
    });

    it ('should show popup and redirect to homepage when clicking on add-report if not logged in ', async() => {
        await homePage.navigateTo();

        const demoPage = await homePage.goToDemo();
        const popup = await demoPage.clickAddReportNotLogged();

        expect(popup.getMessageText()).toEqual('Occorre essere registrati per compiere questa azione.');

        popup.closePopup();

        expect(homePage.isLoginButtonPresent()).toEqual(true);
    });
});
