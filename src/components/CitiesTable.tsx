import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';

const CitiesTable: React.FC = () => {
  const [cities, setCities] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    fetchData();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (search.trim() !== '') {
      filterCities(search.trim());
    } else {
      fetchData();
    }
  }, [search]); // Call fetchData whenever search term changes

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight &&
      !loading &&
      hasMore
    ) {
      fetchMoreData();
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?rows=100`
      );
      const data = await response.json();
      setCities(data.results);
      setPage(2); // Initial page loaded, next page to load is page 2
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setLoading(false);
    }
  };

  const fetchMoreData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?rows=100&page=${page}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        setCities(prevCities => [...prevCities, ...data.results]);
        setPage(page + 1); // Increment page for next load
      } else {
        setHasMore(false); // No more data available
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching more cities:', error);
      setLoading(false);
    }
  };

  const filterCities = (cityName: string) => {
    const filteredCities = cities.filter(city =>
      city.name.toLowerCase().includes(cityName.toLowerCase())
    );
    setCities(filteredCities);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className='min-h-screen bg-sky-200'>
      <div className='flex justify-center items-center'>
        <div className='flex mt-10 justify-center gap-2 items-center p-2 text-gray-800 bg-gray-100 rounded-full outline-none' style={{ maxWidth: '300px' }}>
          <CiSearch size='18px'/>
          <input className='bg-transparent outline-none px-2' type="text" value={search} onChange={handleSearchChange} placeholder="Search city..." />
        </div>
      </div>

      <div className='m-7 flex justify-center'>
        <table className='border-collapse border-2 border-gray-500'>
          <thead>
            <tr>
              <th className='border border-gray-400 px-4 py-2 text-gray-800'>City Name</th>
              <th className='border border-gray-400 px-4 py-2 text-gray-800'>Country</th>
              <th className='border border-gray-400 px-4 py-2 text-gray-800'>Code</th>
              <th className='border border-gray-400 px-4 py-2 text-gray-800'>Timezone</th>
              <th className='border border-gray-400 px-4 py-2 text-gray-800'>Population</th>
            </tr>
          </thead>
          <tbody>
            {cities.map(city => (
              <tr key={city.geoname_id}>
                <td className='border border-gray-400 px-4 py-2'>
                  <Link to={`/weather/${city.name}`}>{city.name}</Link>
                </td>
                <td className='border border-gray-400 px-4 py-2'>{city.cou_name_en}</td>
                <td className='border border-gray-400 px-4 py-2'>{city.country_code}</td>
                <td className='border border-gray-400 px-4 py-2'>{city.timezone}</td>
                <td className='border border-gray-400 px-4 py-2'>{city.population}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && !hasMore && <p>End of data</p>}
    </div>
  );
};

export default CitiesTable;

