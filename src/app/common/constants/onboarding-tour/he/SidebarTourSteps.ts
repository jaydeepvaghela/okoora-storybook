import { Config } from "driver.js";

const windowWidth = window.screen.width;
const SidebarTourSteps: Config = {
  steps: [
    {
      element: '#navDashboard',
      popover: {
        description:
          `<div class="popup-inner">
            <div class="modal-bnr">
              <img src="assets/images/walkme/onboarding-stap01.png">
              <div class="modal-bnr-text">דשבורד מרכזי</div>
            </div>
            <div class="modal-description">
              <p>ניהול כלל הפעילות המטבעית במקום אחד.</p>
              <p>כל דשבורד מציג נתונים בצמד מטבעות רלוונטי</p>
              <ul>
                <li>הזדמנויות ,סיכוני שוק וגרפים.</li>
                <li>פעולות תשלום, המרה והגנה מהירות.</li>
                <li>תמונת מצב על מצגת ההגנות הנוכחית.</li>
              </ul>
              <p>בנוסף, לוח שנה רב מטבעי לניהול התראות, תשלומים, המרות<br> והגנות מטבע.</p>
            </div>
          </div>`,
        progressText: '1/7',
        side: 'right',
        align: windowWidth <= 1600 ? 'center' : 'start'
      }
    }, {
      element: '#navPayments',
      popover: {
        description:
        `<div class="popup-inner">
            <div class="modal-bnr">
              <img src="assets/images/walkme/onboarding-stap02.png">
              <div class="modal-bnr-text">תשלומים</div>
            </div>
            <div class="modal-description">
              <ul class="pt-0">
                <li>שליחת תשלום</li>
                <li>תשלום מרובה למספר ספקים</li>
                <li>נעילת שער וביצוע תשלום למועד עתידי</li>
                <li>דוחות ומידע היסטורי</li>
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
        description:
        `<div class="popup-inner">
            <div class="modal-bnr">
              <img src="assets/images/walkme/onboarding-stap03.png">
              <div class="modal-bnr-text">קבלת כספים</div>
            </div>
            <div class="modal-description">
              <ul class="pt-0">
                <li>דו”ח כספים במקום אחד בזמן אמת</li>
                <li>בקשות תשלומים</li>
                <li>סטטיסטיקה לחודש/שנה</li>
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
        description:
        `<div class="popup-inner">
            <div class="modal-bnr">
              <img src="assets/images/walkme/onboarding-stap04.png">
              <div class="modal-bnr-text">ניהול תהליכי רכש</div>
            </div>
            <div class="modal-description">
              <ul class="pt-0">
                <li>העלאה של חשבוניות ודרישות תשלום</li>
                <li>נתוני רווח \\הפסד לחשבונית והזמנת רכש</li>
                <li>ניתוח תהליך רכש ברמת הזמנה או חשבונית בודדת</li>
                <li>הגנה על חשבוניות</li>
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
        description:
        `<div class="popup-inner">
            <div class="modal-bnr">
              <img src="assets/images/walkme/onboarding-stap05.png">
              <div class="modal-bnr-text">דו”חות</div>
            </div>
            <div class="modal-description">
              <ul class="pt-0 ul-fifty">
                <li>תנועות עו"ש</li>
                <li>דוח יתרות</li>
                <li>עסקאות הגנה</li>
                <li>דוח תנועות מטבעי</li>
                <li>אפשרות ייצוא לאקסל</li>
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
        description:
        `<div class="popup-inner">
            <div class="modal-bnr">
              <img src="assets/images/walkme/onboarding-stap06.png">
              <div class="modal-bnr-text">התראות</div>
            </div>
            <div class="modal-description">
              <ul class="pt-0 ul-fifty">
                <li>התראות על שער חליפין</li>
                <li>יתרת ארנק זמינה</li>
                <li>התראות על יתרת ארנק</li>
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
        description:
        `<div class="popup-inner">
            <div class="modal-bnr">
              <img src="assets/images/walkme/onboarding-stap07.png">
              <div class="modal-bnr-text">מוטבים ומשלמים</div>
            </div>
            <div class="modal-description">
              <ul class="pt-0 ul-fifty">
                <li>דוח משלמים\\מוטבים</li>
                <li>ביצוע תשלום למוטב</li>
                <li>הקמת משלם\\מוטב</li>
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
