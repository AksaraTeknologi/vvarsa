<?php

namespace App\Mail;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderReceiptMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Order $order
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Struk Pesanan #{$this->order->order_number}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.order-receipt',
        );
    }

    /**
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        $pdf = Pdf::loadView('pdf.order-receipt', [
            'order' => $this->order,
        ]);

        return [
            Attachment::fromData(
                fn () => $pdf->output(),
                "struk-{$this->order->order_number}.pdf"
            )->withMime('application/pdf'),
        ];
    }
}
