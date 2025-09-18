const ArtistBio = ({ bio }) => (
    <p className="text-gray-300 leading-relaxed">{bio || "No bio available."}</p>
  );
  export default ArtistBio;