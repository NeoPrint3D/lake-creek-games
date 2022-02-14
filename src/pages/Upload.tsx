import { ClassicElement, useEffect, useState } from "react";
import JSZip from "jszip";

import { storage, db, auth } from "../utils/firebase";

import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";

import { setDoc, doc, serverTimestamp } from "firebase/firestore/lite";

import { uid as id } from "uid";

//import the id library

function Upload() {
  const [thumbnail, setThumbnail] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gameFiles, setGameFiles] = useState<File[]>([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    console.log(gameFiles);
    console.log(thumbnail);
  }, [gameFiles, thumbnail]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDone(false);

    const ID = id(8);

    //gnerate a unique id

    const cleanTitle = title.replace(/\s+/g, "-").toLowerCase();

    const asset = [];
    const gameList = [];

    //zip the files

    for (let i = 0; i < gameFiles.length; i++) {
      //determine if the file is an image or other
      {
        gameFiles[i].type.includes("image")
          ? asset.push(gameFiles[i])
          : gameList.push(gameFiles[i]);
      }
    }

    const merged = [...asset, ...gameList];

    const zip = new JSZip();
    //add the files to the zip

    for (let i = 0; i < merged.length; i++) {
      if (merged[i].name.includes(".png") || merged[i].name.includes(".jpg")) {
        //get the parent directory
        const parent = merged[i].webkitRelativePath.split("/");
        {
          parent.length > 1
            ? zip.folder(parent[1])?.file(merged[i].name, merged[i])
            : zip.file(merged[i].name, merged[i]);
        }
      } else {
        zip.file(merged[i].name, merged[i]);
      }
    }

    const blob: Blob = await zip.generateAsync({ type: "blob" });

    const gameFileUrl = new Promise((resolve, reject) => {
      uploadBytesResumable(
        ref(storage, `/pendingGames/${cleanTitle}-${ID}/${cleanTitle}.zip`),
        blob
      ).on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          const url = getDownloadURL(
            ref(storage, `/pendingGames/${cleanTitle}-${ID}/${cleanTitle}.zip`)
          );
          resolve(url);
        }
      );
    });

    //upload the thumbnail as a promise
    const thumbnailPromise = new Promise((resolve, reject) => {
      uploadBytesResumable(
        ref(storage, `/pendingGames/${cleanTitle}-${ID}/thumbnail.png`),
        thumbnail[0]
      ).on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          console.log("done");
          const url = getDownloadURL(
            ref(storage, `/pendingGames/${cleanTitle}-${ID}/thumbnail.png`)
          );
          resolve(url);
        }
      );
    });

    const thumbnailURL = await thumbnailPromise;
    const gameFileURL = await gameFileUrl;

    await setDoc(doc(db, `/pendingGames/${cleanTitle}-${ID}`), {
      id: `${cleanTitle}-${ID}`,
      title,
      description,
      gameFileUrl: gameFileURL,
      thumbnail: thumbnailURL,
      author: auth.currentUser?.uid,
      authorPhoto: auth.currentUser?.photoURL,
      authorName: auth.currentUser?.displayName,
      createdAt: serverTimestamp(),
    });
    setProgress(0);
    setIsDone(true);
  };

  return (
    <div className="flex flex-col items-center mt-5">
      {!isDone && progress > 0 && (
        <div className="flex flex-col items-start justify-center fixed h-screen">
          <div className="flex flex-col items-center justify-center bg-purple-500 p-3 rounded-xl shadow-2xl">
            <div className="flex justify-around items-center w-full my-5">
              <h5 className="text-hite text-3xl font-extrabold">Progress</h5>
              <h5 className="text-2xl font-bold">{progress}%</h5>
            </div>
            <progress
              className={`progress progress-success w-96 h-10`}
              value={progress}
              max="100"
            ></progress>
          </div>
        </div>
      )}

      <div className="my-5">
        <h5 className="text-5xl font-bold">Upload</h5>
      </div>

      <form
        className="flex flex-col justify-center items-center bg-gradient-to-b from-yellow-500 to-yellow-300 p-5 w-11/12 max-w-2xl rounded-3xl"
        onSubmit={(e) => {
          auth.currentUser?.email
            ? handleSubmit(e)
            : alert("Please login to upload");
        }}
      >
        <div className="form-control">
          <label className="text ">
            <span className="text-2xl">Title</span>
          </label>
          <input
            placeholder="Title"
            className="bg-white w-96 max-w-sm p-3 border-2 text-black rounded-2xl"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="text-2xl">Description</span>
          </label>
          <textarea
            placeholder="Description"
            className="bg-white w-96 max-w-sm p-3 border-2 text-black rounded-2xl"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="text-2xl">Thumbnail</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="bg-blue-500 w-96 max-w-sm p-3 text-white text-xl font-bold rounded-2xl hover:bg-blue-900 file:border-0 file:rounded-2xl file:bg-transparent file:text-white"
            onChange={(e) => setThumbnail(e.target.files as any)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="text-2xl">Game File</span>
          </label>
          <input
            type="file"
            //plain blue buttoon
            className="bg-blue-500 w-96 max-w-sm p-3 text-white text-xl font-bold rounded-2xl hover:bg-blue-900 file:border-0 file:rounded-2xl file:bg-transparent file:text-white"
            onChange={(e) => setGameFiles(e.target.files as any)}
            //@ts-ignore
            webkitdirectory=""
            multiple={true}
          />
        </div>
        <div className="form-control mt-10">
          <input
            className="bg-blue-500 hover:bg-blue-700 text-2xl text-white font-bold p-3 rounded-2xl disabled:bg-gray-500/40"
            type="submit"
            disabled={!title || !description || !thumbnail || !gameFiles}
          />
        </div>
      </form>
    </div>
  );
}

export default Upload;
