import SWRConsumer from "./SWRConsumer";

const api = [ "/api/pos", 
              "/api/categories",
              "/api/menu-items",
              ];

const baseURL = process.env.NEXTAUTH_URL;

async function getInitialData() {
  let data = {};
  for (let i = 0; i < api.length; i++) {
    const response = await fetch(baseURL + api[i]);
    const json = await response.json();
    data = {...data, [api[i]]: json};
    // if (api[i] == "/api/pos") {
    //   for (let j = 0; j < json.length; j++) {
    //     const response = await fetch(baseURL + '/api/inventory?pos=' + json[j]._id);
    //     const inventory = await response.json();
    //     data = {...data, ['/api/inventory?pos='+json[j]._id]: inventory};
    //   }
    // }
  }
  return data;
}


export default async function SWRProvider({ children }) {
  const data = await getInitialData();
  return <SWRConsumer initialData={data}>
      {children}
    </SWRConsumer>
};