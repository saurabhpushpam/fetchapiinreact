// import React, { useEffect, useState } from 'react'

// const Fetch_getapi = () => {

//   const [data, setdata] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:8000/api/getdata").then((result) => {
//       result.json().then((resp) => {
//         console.log("result", resp)
//         setdata(resp)
//       })
//     })
//   }, [])
//   console.log(data);

//   return (
//     <>
//       <h1>Get API Call</h1>
//       <table border="1">
//         <tbody>
//           <tr>
//             <td>id</td>
//             <td>title</td>
//             <td>date</td>
//             <td>phone</td>
//             <td>image</td>
//           </tr>
//           {
//             data.map((item) =>
//               <tr>
//                 <td>{item.id}</td>
//                 <td>{item.title}</td>
//                 <td>{item.date}</td>
//                 <td>{item.phone}</td>
//                 <td>{item.image}</td>
//               </tr>
//             )
//           }
//         </tbody>
//       </table >
//     </>
//   )
// }

// export default Fetch_getapi;


// import React, { useState, useEffect } from 'react';

// const Fetch_getapi = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('https://jsonplaceholder.typicode.com/todos'); // Replace with your API endpoint
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const result = await response.json();
//         setData(result);
//       } catch (error) {
//         setError(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error: {error.message}</p>;
//   }

//   return (
//     <div>
//       <h1>Fetch Data Example</h1>
//       <ul>
//         {data.map((item) => (
//           <li key={item.id}>{item.title}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Fetch_getapi;



// import React, { useState, useEffect } from 'react';

// const Fetch_getapi = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/api/getdata');
//         const jsonData = await response.json();
//         setData(jsonData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <h1>Data from API</h1>
//       <ul>
//         {data.map(item => (
//           <li key={item.id}>
//             <p>ID: {item.id}</p>
//             <p>Title: {item.title}</p>
//             <p>Description: {item.description}</p>
//             <p>phone: {item.phone}</p>
//             <img src={item.image} alt={`Image for ${item.title}`} />
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Fetch_getapi;


// import { useEffect, useState } from 'react';
// function Fetch_getapi() {

//   const [data, setData] = useState([])

//   useEffect(() => {

//     fetch("https://gauravimages.onrender.com/api/getAllData").then((result) => {
//       result.json().then((resp) => {
//         // console.log(resp);

//         setData(resp);

//       })
//     })



//   }, []);
//   // Hm [] pass karenge taki ek bar hi chale

//   // console.log(data);

//   return (
//     <>
//       <h1>Get API Call</h1>

//       {/* <h2>{data}</h2> */}

//       <table border="1">
//         <tr>
//           <td>ID</td>
//           <td>Name</td>

//           <td>Image</td>
//         </tr>
//         {/* jo data hia usko map karenge */}

//         {
//           data.map((item) =>
//             <tr>
//               <td>{item.title}</td>
//               <td>{item.description}</td>
//               <td>{item.images}</td>
//             </tr>
//           )
//         }



//       </table>


//     </>
//   );
// }

// export default Fetch_getapi;

import React, { useState, useEffect } from 'react';

const Fetch_getapi = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/getdata');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Data from API</h1>
      {Array.isArray(data) && data.length > 0 ? (
        <ul>
          {data.map(item => (
            <li key={item.id}>
              <p>ID: {item.id}</p>
              <p>Title: {item.title}</p>
              <p>Description: {item.description}</p>
              <p>phone: {item.phone}</p>
              <img src={item.image} alt={`Image for ${item.title}`} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Fetch_getapi;
