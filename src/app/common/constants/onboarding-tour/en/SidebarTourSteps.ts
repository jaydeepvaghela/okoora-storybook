import { Config } from "driver.js";
const windowWidth = window.screen.width;

const SidebarTourSteps: Config = {
  
  steps: [
    {
      element: '#navDashboard',
      popover: {
        // title: 'Dashboard',
        description:   `<div class="popup-inner">
        <div class="modal-bnr">
          <img src="assets/images/walkme/onboarding-stap01.png">
          <div class="modal-bnr-text">Main Dashboard </div>
        </div>
        <div class="modal-description">
          <p>Manage all your currency activities in one place. Every dashboard displays data for the relevant currency pair.</p>
          <ul>
            <li>Market opportunities and risks and graphs.</li>
            <li>Rapid payment, conversion and hedging actions.</li>
            <li>A snapshot of current hedging presentation.</li>
          </ul>
          <p>In addition, a multi-currency calendar for the management of alerts, payments, conversions and currency hedges.</p>
        </div>
      </div>`,
    progressText: '1/7',
    side: 'right',
    align: windowWidth <= 1600 ? 'center' : 'start'
      }
    }, {
      element: '#navPayments',
      popover: {
        // title: 'Payments',
        description:  `<div class="popup-inner">
        <div class="modal-bnr">
          <img src="assets/images/walkme/onboarding-stap02.png">
          <div class="modal-bnr-text">Payments</div>
        </div>
        <div class="modal-description">
          <ul class="pt-0">
            <li>Send payment</li>
            <li>Mass payment to multiple suppliers</li>
            <li>Lock rate and execute payment for a future date </li>
            <li>Reports and historical data</li>
          </ul>
        </div>
      </div>`,
    progressText: '2/7',
    side: 'right',
    align: windowWidth <= 1600 ? 'center' : 'start'
      }
    }, {
      element: '#navReceiveFunds',
      popover: {
        // title: 'Receive funds',
        description:  `<div class="popup-inner">
        <div class="modal-bnr">
          <img src="assets/images/walkme/onboarding-stap03.png">
          <div class="modal-bnr-text">Received funds</div>
        </div>
        <div class="modal-description">
          <ul class="pt-0">
            <li>Real-time cash flow statement</li>
            <li>Payment requests</li>
            <li>Monthly/annual statistics</li>
          </ul>
        </div>
      </div>`,
    progressText: '3/7',
    side: 'right',
    align: windowWidth <= 1600 ? 'center' : 'start'
      }
    }, {
      element: '#purchase-link',
      popover: {
        // title: 'Purchases',
        description:  `<div class="popup-inner">
        <div class="modal-bnr">
          <img src="assets/images/walkme/onboarding-stap04.png">
          <div class="modal-bnr-text procure-text">Procurement <br/>Management</div>
        </div>
        <div class="modal-description procure-info">
          <ul class="pt-0">
            <li>Uploading invoices and payment requests</li>
            <li>Profit/loss data for invoices and procurement orders</li>
            <li>Analysis of procurement process at the level of a single order or invoice</li>
            <li>Hedging for invoices</li>
          </ul>
        </div>
      </div>`,
    progressText: '4/7',
    side: 'right',
    align: windowWidth <= 1600 ? 'center' : 'start'
      }
    }, {
      element: '#navReports mat-expansion-panel-header',
      popover: {
        // title: 'Reports',
        description: `<div class="popup-inner">
        <div class="modal-bnr">
          <img src="assets/images/walkme/onboarding-stap05.png">
          <div class="modal-bnr-text">Reports</div>
        </div>
        <div class="modal-description">
          <ul class="pt-0 ul-fifty">
            <li>Current account activity</li>
            <li>Balances report</li>
            <li>Hedging transactions</li>
            <li>Currency activity report</li>
            <li>Option to export reports to Excel to view offline.</li>
            
            
          </ul>
        </div>
      </div>`,
    progressText: '5/7',
    side: 'right',
    align: windowWidth <= 1600 ? 'center' : 'start'
      }
    }, {
      element: '#navAlerts',
      popover: {
        // title: 'Alerts',
        description:  `<div class="popup-inner">
        <div class="modal-bnr">
          <img src="assets/images/walkme/onboarding-stap06.png">
          <div class="modal-bnr-text">Alerts</div>
        </div>
        <div class="modal-description">
          <ul class="pt-0 ul-fifty">
            <li>Exchange rate alerts</li>
            <li>Available wallet balance</li>
            <li>Wallet balance alerts</li>
          </ul>
        </div>
      </div>`,
    progressText: '6/7',
    side: 'right',
    align: windowWidth <= 1600 ? 'center' : 'start'
      }
    }, {
      element: '#navContacts',
      popover: {
        // title: 'Contacts',
        description:  `<div class="popup-inner">
        <div class="modal-bnr">
          <img src="assets/images/walkme/onboarding-stap07.png">
          <div class="modal-bnr-text recipient-text">Recipients & <br/>Payees</div>
        </div>
        <div class="modal-description">
          <ul class="pt-0 ul-fifty">
            <li>Payee/recipient report</li>
            <li>Issue payment to recipient</li>
            <li>Creating payee/recipient</li>
            
          </ul>
        </div>
      </div>`,
    progressText: '7/7',
    side: 'right',
    align: windowWidth <= 1600 ? 'center' : 'start'
      }
    }
  ]
}

export default SidebarTourSteps;
