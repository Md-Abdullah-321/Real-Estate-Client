import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

function Search() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sidebardata, setSitebardate] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSitebardate({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();

      const res = await fetch(`/api/listing/get?${searchQuery}`);

      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);
  const handleChange = (e) => {
    if (
      e.target.name === "all" ||
      e.target.name === "rent" ||
      e.target.name === "sale"
    ) {
      setSitebardate({ ...sidebardata, type: e.target.name });
    }

    if (e.target.name === "searchTerm") {
      setSitebardate({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.name === "parking" ||
      e.target.name === "furnished" ||
      e.target.name === "offer"
    ) {
      setSitebardate({
        ...sidebardata,
        [e.target.name]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.name === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";

      setSitebardate({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();

    setListings([...listings, ...data]);

    if (data.length < 9) {
      setShowMore(false);
    }
  };

  console.log(listings.length);
  return (
    <div className="flex flex-col md:flex-row">
      {/* left side  */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              className="border rounded-lg p-3 w-full"
              type="text"
              name="searchTerm"
              value={sidebardata.searchTerm}
              onChange={handleChange}
              placeholder="Search..."
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
                name="all"
                className="w-5"
              />
              <span>Rent & Sale</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
                name="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
                type="checkbox"
                name="sale"
                className="w-5"
              />
              <span>Sale</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={sidebardata.offer}
                name="offer"
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={sidebardata.parking}
                name="parking"
                className="w-5"
              />
              <span>Parking</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                name="furnished"
                onChange={handleChange}
                checked={sidebardata.furnished}
                className="w-5"
              />

              <span>Furnished</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              name="sort_order"
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              className="border rounded-lg p-3"
            >
              <option value="regulerPrice_desc">Price high to low</option>
              <option value="regulerPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      {/* right side  */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>

        <div className="p-5 flex flex-col sm:flex-row flex-wrap gap-2">
          {!loading && listings.length === 0 && (
            <p className="text-lg text-slate-700">No listing found!</p>
          )}

          {loading && (
            <p className="text-lg text-slate-700 w-full text-center">
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((item) => {
              return <ListingItem key={item._id} listing={item} />;
            })}
          {showMore && (
            <button
              className="text-green-700 hover:underline p-7 w-full text-center"
              onClick={handleShowMore}
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
