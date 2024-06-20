'use client';
import { useQRCode } from 'next-qrcode';

export default function QRCode({sum}) {
    const { SVG } = useQRCode();

    return (
        <SVG
          text={'https://qr.nspk.ru/AS1A00103E2OQVDL9MBRAJHJI95EHENK?type=01&bank=100000000111&sum='+ (sum * 100) +'&crc=D504'}
          logo={{
            src : '',
          }}
          options={{
            type: 'image/jpeg',
            //width: 600,
            quality: 1,
            errorCorrectionLevel: 'H',
            scale: 4,

            margin: 4,
            color: {
              dark: '#000000',
              light: '#fff089',
            },
          }}
        />
      )
}