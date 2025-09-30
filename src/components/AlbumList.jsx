import AlbumCard_API from "./AlbumCard_API";

const AlbumList = ({ albums }) => (
    <div className="flex space-x-6">
      {albums.length === 0 && <div className="text-gray-400">No albums available.</div>}
      {albums.map(album => (
        <AlbumCard_API album={album} key={album._id || album.id} />
      ))}
    </div>
  );
  export default AlbumList;