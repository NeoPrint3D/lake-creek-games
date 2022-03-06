import { useState, useEffect, useContext } from 'react'
import { UserContext } from "../contexts/user";
import useSearchResults from '../hooks/useSearchResults';
import { AiOutlineSearch } from 'react-icons/ai'
import { Link } from 'react-router-dom'





function createMarkup(str: string) {
    return { __html: str };
}



export default function Search() {
    const user = useContext(UserContext);
    const [search, setSearch] = useState("");

    const results = useSearchResults(search)

    return (
        <div className='min-h-screen '>
            <div className="flex justify-center my-16 text-black p-3">
                <input type="search" placeholder="Type in more than three charcters" className="w-full max-w-sm  md:max-w-2xl px-5 py-5 rounded-l-full" onChange={(e) => setSearch(e.target.value)} />
                <div className="transition-all flex justify-center items-center bg-yellow-300 rounded-r-full ">
                    <div className='bg-yellow-300 rounded-full p-3 roll-in'>
                        <AiOutlineSearch className=' text-white ' size={50} />
                    </div>
                </div>

            </div>


            <div className='flex flex-col items-center gap-10'>
                {results.map((result) => (
                    <div className="flex flex-col items-center justify-center bg-gradient p-3 rounded-xl shadow-2xl w-3/4 text-white">
                        <div className="flex justify-around items-center w-full my-5">
                            <Link to={`/games/${result.objectID}`} dangerouslySetInnerHTML={createMarkup(result._highlightResult.title.value)} className="transition-transform text-5xl font-extrabold active:scale-90"></Link>
                            <div className='text-xl font-semibold' dangerouslySetInnerHTML={createMarkup(
                                result._highlightResult.description.value
                            )}></div>

                        </div>

                    </div>
                ))}


            </div>

        </div>
    );
}