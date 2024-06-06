export async function GET(req) {
  const url = new URL(req.url);
  const pos = url.searchParams.get('pos');

  const invTrans = await (await fetch(process.env.NEXTAUTH_URL+'/api/invTrans?pos=' + pos)).json();
  const orderTrans = await (await fetch(process.env.NEXTAUTH_URL+'/api/orderTrans?pos=' + pos)).json();

  const output = Object.values(
    [].concat(invTrans, orderTrans).reduce((accu, { id, ...item }) => {
      if (!accu[id]) accu[id] = {qty:0}
      accu[id] = { 
        id,
        ...accu[id],
        ...item,
        qty: accu[id].qty + item.qty
      }
      return accu;
    }, {}),
  );

  return Response.json( output );
}