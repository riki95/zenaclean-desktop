import {by, element} from 'protractor';
import {VoteConfirmPo} from './VoteConfirm.po';
import {PopupPo} from './Popup.po';



export class SingleReportViewPo {
    async getTitle() {
        return await element(by.id('modal_report_title')).getText();
    }

    async getDescription() {
        return await element(by.id('modal_report_description')).getText();
    }

    async votePositive() {
        await element(by.id('button-vote-positive')).click();

        return new VoteConfirmPo();
    }

    async voteNegative() {
        await element(by.id('button-vote-negative')).click();

        return new VoteConfirmPo();
    }

    async votePositiveFail() {
        const button = await element(by.id('button-vote-positive')).click();

        return new PopupPo();
    }

    async voteNegativeFail() {
        const button = await element(by.id('button-vote-negative')).click();

        return new PopupPo();
    }

    async getStatusPositive() {
        return await element(by.id('report-approved-positive'));
    }

    async getStatusNegative() {
        return await element(by.id('report-approved-negative'));
    }

    async closePopup() {
        return await element(by.id('close-single-report-view')).click();
    }
}
