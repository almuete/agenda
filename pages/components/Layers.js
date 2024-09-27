import { TrashIcon } from '@heroicons/react/solid'

export default function Layers ({ ...pageProps }) {
    const { layerItems, handleDeleteLayerItem } = pageProps;
    return (
        <ul className="list-outside ">
            {layerItems.map(function(name,index) {
                return (
                    <li key={index} className="hover:bg-blue-600 cursor-pointer flex items-center justify-between p-2 px-4 space-x-4 border border-gray-500 mt-2 rounded-full">
                        <div>{index+1}. {name}</div>
                        <div className="text-white w-4 h-4 cursor-pointer" onClick={() => handleDeleteLayerItem(index)}>
                        <TrashIcon />
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}
