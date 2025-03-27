import { Meta, StoryObj } from '@storybook/angular';
import { CardListComponent } from './card-list.component';
import { CardComponent } from '../card/card.component';

const meta: Meta<CardListComponent> = {
  title: 'Components/CardList',
  component: CardListComponent,
  tags: ['autodocs'], // Enables automatic documentation
  parameters: {
    layout: 'padded', // Optional: Adjusts layout in Storybook
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [CardComponent],
    },
  }),
};

export default meta;
type Story = StoryObj<CardListComponent>;

export const Default: Story = {
  args: {
    cards: [
      {
        imageSrc: 'https://picsum.photos/200',
        title: 'Convert & Pay',
        subtitle: 'By Okoora',
        description: 'Save fees and send free payments',
        backgroundColor: '#ddd',
        titleColor: '#1a1a1a',
        hoverColor: '#e9e9e9',
        fullWidth: false,
        counter: 0,
        isLiked: false,
        isSaved: false,
      },
      {
        imageSrc: 'https://picsum.photos/200',
        title: 'Secure Payments',
        subtitle: 'By FinanceCorp',
        description: 'Fast and secure international transfers',
        backgroundColor: '#ddd',
        titleColor: '#333333',
        hoverColor: '#e9e9e9',
        fullWidth: false,
        counter: 0,
        isLiked: false,
        isSaved: false,
      },
    ],
  },
};
