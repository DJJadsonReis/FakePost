export function PostAudioPlayer({ postAudio }: { postAudio: string }) {
  return postAudio ? (
    <div className="mt-3">
      <audio controls src={postAudio} className="w-full h-10">
        Your browser does not support the audio element.
      </audio>
    </div>
  ) : null;
}
