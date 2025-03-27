import { Meta, StoryObj } from '@storybook/angular';
import { CardComponent } from './card.component';
import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { EventEmitter } from '@angular/core';
const meta: Meta<CardComponent> = {
    title: 'Components/Card',
    component: CardComponent,
    tags: ['autodocs'], // Enables automatic documentation
    parameters: {
        layout: 'padded', // Adjusts layout in Storybook
    },
};
export default meta;

type Story = StoryObj<CardComponent>;

export const Default: Story = {
    args: {
        imageSrc: "https://picsum.photos/300",
        title: "Convert & Pay",
        subtitle: 'Payment',
        description: 'Get more from your money, save fees and send free regular payments',
        backgroundColor: "#83d0e3",
        titleColor: "#403c3c",
        subtitleColor: '#1a1a1a',
        descColor: '#1a1a1a',
        hoverColor: "#b3b452",
        fullWidth: false,
        counter: 0,
        isLiked: false,
        isSaved: false,
    },
    render: (args) => ({
        props: {
            ...args,
            liked: new EventEmitter<void>(),
            saved: new EventEmitter<void>(),
            paid: new EventEmitter<number>(),
        },
        template: `
        <app-card 
          [imageSrc]="imageSrc"
          [title]="title"
          [subtitle]="subtitle"
          [description]="description"
          [backgroundColor]="backgroundColor"
          [titleColor]="titleColor"
          [subtitleColor]="subtitleColor"
          [descColor]="descColor"
          [hoverColor]="hoverColor"
          [fullWidth]="fullWidth"
          [counter]="counter"
          [isLiked]="isLiked"
          [isSaved]="isSaved"
          (liked)="liked.emit(); ${action('liked event triggered')()}"
          (saved)="saved.emit(); ${action('saved event triggered')()}"
          (paid)="paid.emit(counter); ${action('paid event triggered')(args.counter)}"
        ></app-card>
      `,
    }),
};