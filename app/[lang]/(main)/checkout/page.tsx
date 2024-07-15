import Container from '@/components/Container';
import { STATUS_MESSAGES } from '@/lib/enums';
import { IResponse } from '@/lib/types';
import apiHandler from '@/lib/utils/apiHandler';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import ThankYou from './components/ThankYou';
import { getDictionary } from '@/lib/utils/dictionary';
import CheckoutError from './components/CheckoutError';
import { redirect } from 'next/navigation';
import webRoutes from '@/lib/utils/webRoutes';

const checkout = async (searchParams: any) => {
  try {
    const cookiesData: any = cookies().get('checkout')?.value || '{}';
    const checkoutData = JSON.parse(cookiesData);

    if (
      (searchParams['result'] && searchParams['result'] == 'CAPTURED') ||
      (searchParams['payment_method'] == 'cod' && searchParams['hash']) ||
      (searchParams['payment_method'] == 'visa' &&
        searchParams['success'] == 'true')
    ) {
      let paymentDetails: any =
        searchParams['result'] && searchParams['result'] == 'CAPTURED'
          ? {
              paymentid: searchParams['paymentid'],
              trackid: searchParams['trackid'],
              tranid: searchParams['tranid'],
              auth: searchParams['auth'],
              ref: searchParams['ref'],
              amt: searchParams['amt'],
              result: searchParams['result'],
              udf1: searchParams['udf1'],
              udf2: searchParams['udf2'],
              udf3: searchParams['udf3'],
              udf4: searchParams['udf4'],
              udf5: searchParams['udf5'],
              postdate: searchParams['postdate'],
              avr: searchParams['avr'],
              authRespCode: searchParams['authRespCode'],
            }
          : null;

      const hash =
        searchParams['payment_method'] == 'cod'
          ? searchParams['hash']
          : searchParams['payment_method'] == 'visa'
          ? searchParams['reference']
          : paymentDetails?.trackid;

      if (searchParams['payment_method'] == 'visa') {
        const res = await fetch(
          `https://pay.jm3eia.com/api/v1/payment-requests?request_number=${searchParams['reference']}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'app-key': 'APIJM3_PK_5843cx8q99t6b5.64795315',
              'app-secret': 'APIJM3_SK_6421rt7klo1q98.88472366',
            },
          }
        );

        const resData = await res.json();
        console.log('========= CHECKOUT VISA =========: ', res.ok, resData);
        if (
          !res.ok ||
          !resData ||
          !resData.data ||
          resData.data.status != '2'
        ) {
          console.log('*** NOT PAID ***');
          const response: IResponse<{ url: string }> = {
            errors: null,
            results: null,
            status_code: 200,
            status_message: STATUS_MESSAGES.RESOURCE_EXISTS,
            success: false,
          };
          const jsonResponse = NextResponse.json(response);
          jsonResponse.cookies.delete('checkout');
          return jsonResponse;
        }
        paymentDetails = resData.data;
      }

      const body = {
        payment_details: paymentDetails,
        payment_method: searchParams['payment_method'],
        discount_by_wallet: checkoutData['discount_by_wallet'],
        delivery_time: checkoutData['delivery_time'],
        notes: checkoutData['notes'],
        suppliers: checkoutData['suppliers'],
        address_id: checkoutData['address_id'],
        user_data: checkoutData['user_data'],
        isVIP: checkoutData['isVIP'],
        hash,
      };

      const isVIP = checkoutData.isVIP ? checkoutData.isVIP : false;

      const checkoutResponse = await apiHandler(
        '/checkout?web=true&isVIP=' + isVIP,
        'POST',
        body,
        false,
        false
      );

      console.log(
        '========================================== CHECKOUT RESPONSE ==========================================\n',
        checkoutResponse,
        body
      );

      let params = '';
      Object.keys(body).forEach((key) => {
        params += `${key}=${body[key as keyof typeof body]}&`;
      });
      if (checkoutResponse.success) {
        const jsonResponse = NextResponse.json(checkoutResponse);
        jsonResponse.cookies.delete('checkout');
        return jsonResponse;
      } else {
        const jsonResponse = NextResponse.json(checkoutResponse);
        jsonResponse.cookies.delete('checkout');
        return jsonResponse;
      }
    } else {
      const response: IResponse<{ url: string }> = {
        errors: null,
        results: null,
        status_code: 200,
        status_message: STATUS_MESSAGES.RESOURCE_EXISTS,
        success: false,
      };
      const jsonResponse = NextResponse.json(response);
      jsonResponse.cookies.delete('checkout');
      return jsonResponse;
    }
  } catch (err) {
    console.log('CHECKOUT ERROR: ', err);
    const response: IResponse<{ url: string }> = {
      errors: null,
      results: null,
      status_code: 200,
      status_message: STATUS_MESSAGES.RESOURCE_EXISTS,
      success: false,
    };
    const jsonResponse = NextResponse.json(response);
    jsonResponse.cookies.delete('checkout');
    return jsonResponse;
  }
};

export default async function Checkout({ params, searchParams }: any) {
  const checkoutResponse: any = await (await checkout(searchParams)).json();
  const lang = params.lang;

  /* if (!checkoutResponse || !checkoutResponse.success) {
    return redirect(webRoutes.cart);
  } */

  return (
    <div>
      <Container>
        {checkoutResponse.success ? (
          <>
            {/* @ts-expect-error Server Component */}
            <ThankYou
              lang={lang}
              user_data={checkoutResponse.results.user_data}
              orderId={checkoutResponse.results._id}
            />
          </>
        ) : (
          <>
            {/* @ts-expect-error Server Component */}
            <CheckoutError lang={lang} />
          </>
        )}
      </Container>
    </div>
  );
}
