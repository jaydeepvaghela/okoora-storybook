import { Meta, moduleMetadata, StoryObj } from "@storybook/angular";
import { HedgeTandcDetailsComponent } from "./hedge-tandc-details.component";
import { CommonModule } from "@angular/common";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

const meta: Meta<HedgeTandcDetailsComponent> = {
    title: 'Components/Risk-Manager/hedge-tandc-details',
    component: HedgeTandcDetailsComponent,
    argTypes: {
        disclosureContent: {
            control: 'object',
        },
    },
    decorators: [
      moduleMetadata({
        imports: [
          CommonModule,
          MatDialogModule,
          BrowserAnimationsModule // Important for MatDialog animation + overlay behavior
        ],
        providers: [
          { provide: MatDialogRef, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: {} },
        ],
      }),
    ],
};
export default meta;
type Story = StoryObj<HedgeTandcDetailsComponent>;

export const Default: Story = {
    args: {
        disclosureContent: `<p class="paragraph">
        The provisions of this Risk Disclosure apply to Okoora and its Operating Companies, as defined in the Framework Agreement. This disclosure is intended to outline, in a non-exhaustive manner, the risks associated with transactions in foreign exchange, financial assets, and the use of technological platforms for such transactions. By engaging in these transactions, the Client confirms their acknowledgment and acceptance of these risks and their consent to the investment marketing services provided.
      </p>
      <ol class="disclosure-list">
        <div>
          <li>1. Acknowledgment of Risks</li>
          <p class="paragraph">
            The Client explicitly confirms that they have read, understood, and accept all risks detailed in this disclosure and in the Transactions Terms, which form an integral part of this agreement. The Client acknowledges that they are solely responsible for assessing whether each transaction aligns with their financial goals, experience, and capabilities, taking into account their financial situation.
          </p>
          <p class="paragraph">
            The Client acknowledges that this Risk Disclosure should be read in conjunction with the <a href="https://okoora.com/terms_of_services/transaction-terms-and-conditions/">Transactions Terms and Conditions</a>, which detail specific procedures, conditions, and requirements for executing and settling transactions. By proceeding with any transactions, the Client confirms their acceptance of both the Risk Disclosure and the Transactions Terms, assuming full responsibility for any risks, obligations, or losses associated with their trading activities.
          </p>
          <p class="paragraph">
            The Client is strongly encouraged to seek independent financial and legal advice to fully understand the risks and implications of hedging transactions and high-risk financial instruments before proceeding.
          </p>
        </div>
  
        <div>
          <li>2. Irreversibility and Modification of Transactions</li>
          <p class="paragraph">
            Once a transaction is confirmed, the Client cannot cancel or modify it. Additional collateral requirements may be imposed during the transaction period based on changes in market conditions and at the company's discretion. If the Client fails to provide the required collateral promptly, the company may, but is not obligated to, take actions such as closing the transaction and forfeiting the collateral amount at its sole discretion and subject to applicable fees.
          </p>
          <p class="paragraph">The company reserves the right to cancel or modify the transaction in accordance with the agreement.</p>
        </div>
  
        <div>
          <li>3. Market Risks and Fluctuations</li>
          <p class="paragraph">
            Transactions in financial markets involving financial instruments carry special risks, and execution may result in significant losses, including the potential loss of the entire investment. The financial markets, particularly foreign exchange and interest rate markets, are subject to unpredictable influences and fluctuations beyond the service provider's control. These changes may result in significant discrepancies between projected future prices and actual settlement prices, possibly leading to a total loss of funds deposited by the Client.
          </p>
        </div>
  
        <div>
          <li>4. Collateral Requirements and Potential Losses</li>
          <p class="paragraph">
            The Client understands that they may be required to deposit additional substantial collateral if market conditions shift against their position. Failure to do so may result in the forced closure of positions, which could lead to immediate losses and/or prevent future profits if market trends change.
          </p>
          <p class="paragraph">
            The Client acknowledges that they may incur losses exceeding the initial collateral and may need to cover any resulting debt balances. The Client irrevocably authorizes the service provider to take actions involving collateral to cover any outstanding balances, including selling, converting, or charging the collateral in the event of losses.
          </p>
        </div>
  
        <div>
          <li>5. Leverage, Options, and Structured Products</li>
          <p class="paragraph">
            The Client understands that financial leverage due to low collateral requirements can amplify both potential gains and losses. High leverage may result in substantial losses, just as it may result in profits.
          </p>
          <p class="paragraph">
            The Client is aware that each option has an expiration date, after which it becomes void and without value if not exercised or sold. It is the Client’s sole responsibility to be aware of option expiration dates, as the service provider is not obligated to notify the Client.
          </p>
        </div>
  
        <div>
          <li>6. System, Network, and Execution Risks</li>
          <p class="paragraph">
            Trading services are conducted through computer systems, networks, and the Internet. The Client acknowledges that trading may be subject to unforeseen interruptions or delays without prior notice. These interruptions may affect the Client’s ability to execute or cancel orders.
          </p>
          <p class="paragraph">
            In certain market conditions, the Client may find it difficult or impossible to exit a position or execute orders with a price limit. Stop Loss or Stop Limit orders may not necessarily prevent losses to the anticipated levels due to market volatility.
          </p>
        </div>
  
        <div>
          <li>7. Transaction Costs and Tax Deductions</li>
          <p class="paragraph">
            The Client understands that transactions include cost components such as the difference between bid and ask prices and other transaction fees, which may accumulate over time.
          </p>
          <p class="paragraph">All transactions are subject to applicable tax deductions as required by law.</p>
        </div>
  
        <div>
          <li>8. Final Settlement and Reference Rates</li>
          <p class="paragraph">
            At the transaction's maturity date, if the reference rate is higher than the transaction rate, the Client’s account will be credited in the secondary currency with an amount equal to the difference between the rates multiplied by the transaction amount in the primary currency. Conversely, if the reference rate is lower, the Client’s account will be debited in the secondary currency with an amount reflecting the rate difference.
          </p>
          <p class="paragraph">The protection transaction will automatically terminate on the maturity date and upon the publication of the reference rate.</p>
        </div>
  
        <div>
          <li>9. Legal Compliance and Client Responsibility</li>
          <p class="paragraph">
            The Client confirms awareness that all transactions are subject to applicable laws, regulations, and guidelines of various authorities in Israel and abroad (the "Provisions"). The Client agrees to comply with these provisions and waives any claims, demands, or suits related to compliance with such regulations.
          </p>
          <p class="paragraph">
            The Client acknowledges the risks outlined herein and affirms that they have, and will continue to have throughout the term of this agreement, the full capacity to bear any consequences, losses, or payments that may arise from their transactions. The Client’s decisions are made at their sole discretion and responsibility, and the Client releases the service provider from any liability for losses or damages incurred as a result of transactions conducted according to the Client’s instructions.
          </p>
        </div>
      </ol>`,
    }
};
