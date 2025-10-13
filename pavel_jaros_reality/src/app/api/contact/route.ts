import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, consent } = body;

    // Validation
    if (!name || !email || !message || !consent) {
      return NextResponse.json(
        { error: 'Vyplňte prosím všechna povinná pole a potvrďte souhlas se zpracováním údajů.' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Neplatná emailová adresa.' },
        { status: 400 }
      );
    }

    // Phone validation (optional field)
    if (phone) {
      const phoneRegex = /^[\d\s+()-]+$/;
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          { error: 'Neplatné telefonní číslo.' },
          { status: 400 }
        );
      }
    }

    // Log the contact form submission (in production, send email or save to database)
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      message,
      consent,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    // TODO: Implement email sending logic
    // Example using nodemailer or a service like SendGrid, Mailgun, etc.
    // await sendEmail({
    //   to: 'pavel.jaros@example.com',
    //   from: email,
    //   subject: `Nová zpráva z kontaktního formuláře od ${name}`,
    //   html: `
    //     <h2>Nová zpráva z kontaktního formuláře</h2>
    //     <p><strong>Jméno:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Telefon:</strong> ${phone || 'neuvedeno'}</p>
    //     <p><strong>Zpráva:</strong></p>
    //     <p>${message}</p>
    //   `
    // });

    return NextResponse.json(
      {
        success: true,
        message: 'Děkujeme za vaši zprávu! Ozveme se vám co nejdříve.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při odesílání formuláře. Zkuste to prosím znovu.' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
