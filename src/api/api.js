export async function getCashiers({ url }) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const results = urlParams.get('results') || 5; // default to 5 if not provided

    // simulate a database query to retrieve cashiers
    const cashiers = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe'  },
        { id: 3, name: 'Bob Smith'  },
        { id: 4, name: 'Alice Johnson' },
        { id: 5, name: 'Mike Williams' },
        // add more cashiers here...
    ];

    
    // return only the specified number of cashiers
    return {results: cashiers.slice(0, parseInt(results, 10))};
}