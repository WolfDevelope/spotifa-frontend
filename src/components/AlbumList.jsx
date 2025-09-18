import AlbumCard from "./AlbumCard";

const AlbumList = ({ albums }) => (
    <div className="flex space-x-6">
      {albums.length === 0 && <div className="text-gray-400">No albums available.</div>}
      {albums.map(album => (
        <AlbumCard album={album} key={album.id} />
      ))}
    </div>
  );
  export default AlbumList;