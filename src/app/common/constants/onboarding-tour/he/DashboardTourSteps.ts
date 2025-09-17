import { Config } from "driver.js";

const windowWidth = window.screen.width;
// const DashboardTourSteps: Config = {
//   steps: [
//     {
//       element: '#walletList',
//       popover: {
//         description:
//         `<div class="popup-inner">
//           <div class="dashboard-modal-header">Your Wallets</div>
//           <div class="dsmodal-img stap-odd">
//             <img src="assets/images/walkme/dashboard-onboarding-wallets.png">
//           </div>
//           <div class="modal-description">
//             <p>זה המקום בו תוכל לראות את הארנקים שלך והיתרות הפנויות בכל ארנק. כל לחיצה על ארנק מעדכנת את הדשבורד לצמד מטבעות רלוונטי. ניתן להוסיף ארנק חדש בלחיצה על סמן ה + .</p>
//           </div>
//           <div id="skipWrap" class="skip-wrap">
//             <label for="dbOnboardDontShowAgain"><input id="dbOnboardDontShowAgain" type="checkbox">אל תציג שוב</label>
//             <button id="dashboardOnboardSkip" class="ds-skip">דלג</button>
//           </div>
//         </div>`,
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
//           <div class="dashboard-modal-header">Statistics</div>
//             <div class="modal-description">
//               <ul class="pt-0">
//                 <li>יתרת חשבון פנויה</li>
//                 <li>חשבוניות פתוחות וסטטוס רווח\\הפסד לכל חשבונית</li>
//                 <li>אחוז גידור עסקאות הגנה ביחס לחשיפה שנתית.</li>
//                 <li>מצב שוק נוכחי המתאר את סביבת שע"ח והאם מספקת הזדמנות או איום לפעילות העסקית</li>
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
//           <p>פעולה מהירה וביצוע בקליק של מספר פעולות:<strong>התראה, תשלום, המרה ועסקת הגנה.</strong></p>
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
//           <p>לוח שנה רב מטבעי שמאפשר לנהל את הפעילות המטבעית. לנהל תזרים עתידי ולבצע תשלומים, המרות, התראות או עסקאות הגנה לתאריך ספציפי.</p>
//           <p class="mb-16">ניתן להציג את המידע בפריסה שבועית או חודשית.</p>
//           <p>כדי לראות את כל המידע פשוט לחץ על <span class="blue-text">הצג הכל</span>.</p>
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
//               <p>נעילת שער למועד עתידי. הגרף מציג את תנאי השוק העתידיים במטבע הרלוונטי והאם אלו מספקים אפשרות לקבע רווח ביחס לשוק נוכחי. ניתן לבצע נעילת שער לכל פרק זמן עד 12 חודשים קדימה.</p>
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
//               <p>ביצוע פעולת המרה מהירה בלחיצה.</p>
//               <p>רכישה או מכירה מיידית של מטבע הארנק.</p>
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
//               <p class="mb-16">צמצום הסיכון משינוי בשע"ח על ידי ביצוע עסקת הגנה למועד עתידי בשתי תצורות: רכישת ביטוח שער ללא סיכון או ביצוע עסקת הגנה בטווח של שערים.</p>
//               <p>יש לבחור את סוג העסקה, סכום ומועד העסקה.</p>
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
//             <p>גרף היסטורי של צמד המטבעות הרלוונטי לארנק הנוכחי.</p><p>בראש הגרף ניתן לראות את שער השוק ביחס לשער בו בוצע התשלום האחרון במטבע.</p>
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
            <span class="tag">חדש</span>
            <div class="content-wrapper">
              <h2 class="title">פעולות מהירות (1,4)</h2>
              <p class="description">
                סרגל הפעולות המהירות מאפשר להפקיד כספים, ליצור תשלום, להמיר מט"ח, לנעול שער ולהתחבר למערכת ה-ERP
              </p>
              <p class="sub-description">
                * בצעו הפקדה כדי להתחיל, או המשיכו במידה וישנה יתרה בחשבון
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
            <span class="tag">חדש</span>
            <div class="content-wrapper">
              <h2 class="title">תפריט (2/4)</h2>
              <p class="description">
               זהו התפריט הראשי בתצוגה מצומצמת. אותם אזורים ופעולות שאתם מכירים, עכשיו עם גישה מהירה לניווט קל ומהיר יותר
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
            <span class="tag">חדש</span>
            <div class="content-wrapper">
              <h2 class="title">גידור אוטומטי (אוטו-פיילוט) (3/4)</h2>
              <p class="description">
                הגידור האוטומטי (אוטו-פיילוט) נועל את חשיפת המט"ח שלכם ללא צורך בפעולות ידניות — תמיד פועל, כדי שלעולם לא תפספסו עליות/ירידות שערים
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
            <span class="tag">חדש</span>
            <div class="content-wrapper">
              <h2 class="title">הגנה מול חשיפה (4/4)</h2>
              <p class="description">
                תמונת מצב החשיפה שלכם בזמן אמת: מה מוגן, מה חשוף וכל מה שביניהם
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