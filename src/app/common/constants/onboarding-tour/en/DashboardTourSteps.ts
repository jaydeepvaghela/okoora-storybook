import { Config } from "driver.js";
const windowWidth = window.screen.width;
// const DashboardTourSteps: Config = {
//   steps: [
//     {
//       element: '#walletList',
//       popover: {
//         description:
// `<div class="popup-inner">
//   <div class="dashboard-modal-header">Your Wallets</div>
//   <div class="dsmodal-img stap-odd">
//     <img src="assets/images/walkme/dashboard-onboarding-wallets.png">
//   </div>
//   <div class="modal-description">
//     <p>Here you can see your wallets and their respective available balances.</p>
//     <p>A single click on a wallet updates the dashboard to the relevant currency pair. It's possible to add a new wallet by pressing on the + symbol.</p>
//   </div>
//   <div id="skipWrap" class="skip-wrap">
//     <label for="dbOnboardDontShowAgain"><input id="dbOnboardDontShowAgain" type="checkbox">Don't show me again</label>
//     <button id="dashboardOnboardSkip" class="ds-skip">Skip</button>
//   </div>
// </div>`,
//         side: window.screen.width <= 1600 ? 'over' : 'bottom',
//         align: 'center',
//         showButtons: ['close', 'next'],
//         showProgress: false,
//         progressText: ''
//       }
//     }, {
//       element: '#dashboardStatistics',
//       popover: {
//         description:
//         `<div class="popup-inner">
//           <div class="dashboard-modal-header">Figures and Statistics</div>
//             <div class="modal-description">
//               <ul class="pt-0">
//                 <li>Available account balance</li>
//                 <li>Open invoices and profit/loss status for each invoice</li>
//                 <li>Percent of defensive hedge transactions relative to annual risk exposure</li>
//                 <li>Current market status with a description of the foreign exchange rate environment and potential opportunities or threats to business activities.</li>
//               </ul>
//             </div>
//         </div>`,
//         side: window.screen.width <= 1600 ? 'over' : 'bottom',
//         align: 'center',
//         progressText: '1/7'
//       }
//     }, {
//       element: '#calendarAddAction',
//       popover: {
//         description:
//         `<div class="popup-inner">
//         <div class="dashboard-modal-header">Quick Actions button</div>
//         <div class="dsmodal-img stap-odd">
//           <img src="assets/images/walkme/dashboard-onboarding-quick-actions.png">
//         </div>
//         <div class="modal-description">
//           <p>Fast action that implements with a click the following activities: <span class="fw-bold">alert, payment, conversion and hedge.</span></p>
//         </div>
//       </div>`,
//         side: 'left',
//         align: window.screen.width <= 1600 ? 'center' : 'start',
//         progressText: '2/7'
//       }
//     }, {
//       element: '#dashboardCalendar',
//       popover: {
//         description:
//         `<div class="popup-inner">
//         <div class="dashboard-modal-header">Calendar</div>
//         <div class="dsmodal-img">
//           <img src="assets/images/walkme/dashboard-onboarding-calendar.png">
//         </div>
//         <div class="modal-description">
//           <p>A multi-currency calendar that enables managing all currency activities.</p>
//           <p>For managing future cash flows and to execute payments, conversions, alters and hedges on a specific date. </p>
//           <p class="mb-16">Data can be viewed in a weekly or monthly format.</p>
//           <p>To see all the data click on <span class="blue-text">View all</span>.</p>
//         </div>
//       </div>`,
//         side: 'right',
//         align: window.screen.width <= 1600 ? 'center' : 'start',
//         progressText: '3/7'
//       },
//       onDeselected: (event) => {
//         document.body.scrollTop = 0;
//       }
//     }, {
//       element: '#dashboardSideTabs mat-tab-header #mat-tab-label-0-0',
//       popover: {
//         description:
//           `<div class="popup-inner">
//             <div class="dashboard-modal-header">Lock & UP</div>
//             <div class="dsmodal-img">
//               <img src="assets/images/walkme/dashboard-onboarding-lockup.png">
//             </div>
//             <div class="modal-description">
//               <p>Gate locking for future reference. The graph illustrates the future market conditions in the relevant currency and whether they provide an opportunity to secure profit compared to the current market. It is possible to implement gate locking for any period up to 12 months ahead.</p>
//             </div>
//           </div>`,
//         side: 'left',
//         align: 'center',
//         progressText: '4/7'
//       },
//     }, {
//       element: '#dashboardSideTabs mat-tab-header #mat-tab-label-0-1',
//       popover: {
//         description:
//           `<div class="popup-inner">
//             <div class="dashboard-modal-header">Convert now</div>
//             <div class="dsmodal-img">
//               <img src="assets/images/walkme/dashboard-onboarding-convert-now.png">
//             </div>
//             <div class="modal-description">
//               <p>Executing a quick conversion with a click.</p>
//               <p>Immediate purchase or sale of wallet currency.</p>
//             </div>
//           </div>`,
//         side: 'left',
//         align: 'center',
//         progressText: '5/7'
//       }
//     }, {
//       element: '#dashboardSideTabs mat-tab-header #mat-tab-label-0-2',
//       popover: {
//         description:
//           `<div class="popup-inner">
//             <div class="dashboard-modal-header">Hedging</div>
//             <div class="dsmodal-img">
//               <img src="assets/images/walkme/dashboard-onboarding-hedging.png">
//             </div>
//             <div class="modal-description">
//               <p class="mb-16">Risk reduction from changes in exchange rates by executing a future hedge transaction in two forms: purchasing rate insurance without risk or executing a hedge transaction within a range of rates.</p>
//               <p>Please select the type of transaction, amount, and transaction date.</p>
//             </div>
//           </div>`,
//         side: 'left',
//         align: 'center',
//         progressText: '6/7'
//       }
//     }, {
//       element: '#tradingViewChart',
//       popover: {
//         description:
//         `<div class="popup-inner">
//           <div class="dashboard-modal-header">Last Payment rate</div>
//           <div class="dsmodal-img">
//             <img src="assets/images/walkme/dashboard-onboarding-payment-rate.png">
//           </div>
//           <div class="modal-description">
//             <p>A historical graph of the relevant currency pair in the current wallet. At the top of the graph, you can see the market rate of exchange compared with the rate that the last payment was made in that currency.</p>
//           </div>
//         </div>`,
//         side: window.screen.width <= 1600 ? 'over' : 'right',
//         align: 'start',
//         progressText: '7/7'
//       }
//     }
//   ]
// }

// export default DashboardTourSteps;


const DashboardTourSteps: Config = {
  steps: [
    {
      element: '#depositTourStep',
      popover: {
        description:
          `<div class="popup-inner header-tour">
            <span class="tag">New</span>
            <div class="content-wrapper">
              <h2 class="title">Quick actions (1/4)</h2>
              <p class="description">
                The quick action toolbar allows you to deposit, create payment, convert, lock rate and connect to ERP
              </p>
              <p class="sub-description">
                * Deposit to begin, or continue if funded.
              </p>
              <div class="image-container">
                <img src="assets/images/walkme/dashboard-onboarding-deposit.svg" alt="Quick Actions Guide" />
              </div>
            </div>
          </div>`,
        side: 'bottom',
        align: 'start',
        // progressText: ''
      },
      onDeselected: (event) => {
        document.body.scrollTop = 0;
      }
    },
    {
      element: '#sidebarTourInitialStep',
      popover: {
        description:
          `<div class="popup-inner sidebar-tour">
            <span class="tag">New</span>
            <div class="content-wrapper">
              <h2 class="title">Collapsed menu (2/4)</h2>
              <p class="description">
               This is your main menu in a compact view. the same sections and actions you know, now in a quick-access bar for faster navigation.
              </p>
            </div>
          </div>`,
        side: 'top',
        align: 'start',
        // progressText: ''
      },
      onDeselected: (event) => {
        document.body.scrollTop = 0;
      }
    },
    {
      element: '#autoPilotInitialTourStep',
      popover: {
        description:
        `<div class="popup-inner auto-pilot-tour">
            <span class="tag">New</span>
            <div class="content-wrapper">
              <h2 class="title">Auto pilot hedging (3/4)</h2>
              <p class="description">
                Auto-pilot hedging locks your FX exposure without manual steps — always on, never miss a shift.
              </p>
              <div class="image-container">
                <img src="assets/images/walkme/dashboard-onboarding-autopilot-initial.gif" alt="Quick Actions Guide" />
              </div>
            </div>
          </div>`,
        side: 'right',
        align: 'center',
        // progressText: ''
      },
      onDeselected: (event) => {
        document.body.scrollTop = 0;
      }
    }, {
      element: '#autoPilotChartTourStep',
      popover: {
        description:
        `<div class="popup-inner chart-tour">
            <span class="tag">New</span>
            <div class="content-wrapper">
              <h2 class="title">Protected Vs. Exposure (4/4)</h2>
              <p class="description">
                Your real-time risk snapshot protected, exposed, and everything in between.
              </p>
              <div class="image-container">
                <img src="assets/images/walkme/dashboard-onboarding-riskchart.svg" alt="Quick Actions Guide" />
              </div>
            </div>
          </div>`,
        side: 'left',
        align: window.screen.width <= 1600 ? 'center' : 'start',
        // progressText: '2/7'
      },
      onDeselected: (event) => {
        document.body.scrollTop = 0;
      }
    } 
    // {
    //   element: '#enableAutoPilotTourStep',
    //   popover: {
    //     description:
    //       `<div class="popup-inner">
    //       <div class="header">
    //         <h2>You are all set</h2>
    //       </div>

    //       <p class="description">
    //         Automatically protect your FX exposure based on your forecast and preferences no manual steps, no missed opportunities.
    //       </p>

    //       <button class="btn-done">Done</button>

    //       <div class="image-container">
    //         <img src="assets/images/walkme/dashboard-onboarding-finalstep.svg" alt="Quick Actions Guide" />
    //       </div>
    //     </div>`,
    //     side: 'right',
    //     align: window.screen.width <= 1600 ? 'center' : 'start',
    //     progressText: '3/7'
    //   },
    //   onDeselected: (event) => {
    //     document.body.scrollTop = 0;
    //   }
    // }
  ]
}

export default DashboardTourSteps;