import { useState } from 'react';
import '../CSS/SimpleFilter.css';

const SimpleFilter = (props: any) => {
    const [query, setQuery] = useState('');


    const handleFilter = async () => {
        const results = await filter(query, props);
        props.filterTodos(results);
};

    const handleKeyDown = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            handleFilter();
        }
    };

const filter = async (q: string, props: any) => {

    const json = await props.client.models.Todo.list({
        filter: {
            or: [
                {
                    barcode: {
                        contains: q.toUpperCase()
                    }
                },
                {
                    vendorName: {
                        contains: q.toUpperCase()
                    }
                },
                {
                    invoiceDate: {
                        contains: q
                    }
                },
                {
                    entryDate: {
                        contains: q
                    }
                },
                {
                    taxCode: {
                        contains: q
                    }
                }
            ]
        }
    });

    console.log(json.data);
    return json.data;
};
return (
    <div className='simple-filter'>
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for anything..."
        />
        <button onClick={handleFilter}>Search</button>
    </div>
);
};

export default SimpleFilter;