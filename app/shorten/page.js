"use client"
import Link from 'next/link'
import React, { useState } from 'react'

const Shorten = () => {
    const [url, seturl] = useState("")
    const [shorturl, setshorturl] = useState("")
    const [generated, setGenerated] = useState("")

    const generate = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "url": url,
            "shorturl": shorturl
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("/api/generate", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setGenerated(shorturl)
                seturl("")
                setshorturl("")
                console.log(result)
                alert(result.message)
            })
            .catch((error) => console.error(error));
    }

    const editShortUrl = async (shorturl) => {
        const newUrl = prompt("Enter the new destination URL:")
        if (!newUrl) return;

        const res = await fetch("/api/generate", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                shorturl,
                newUrl,
            }),
        });

        const result = await res.json();
        alert(result.message)
        console.log(result)
    }

    const deleteShortUrl = async (shorturl) => {
        const confirmDelete = confirm("Are you sure you want to delete this short URL?")
        if (!confirmDelete) return;

        const res = await fetch("/api/generate", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                shorturl,
            }),
        });

        const result = await res.json()
        alert(result.message)
        console.log(result)
        setGenerated("") // hide after deletion
    }

    return (
        <div className='mx-auto max-w-lg bg-purple-100 my-16 p-8 rounded-lg flex flex-col gap-4'>
            <h1 className='font-bold text-2xl'>Generate your short URLs</h1>
            <div className='flex flex-col gap-2'>
                <input type="text"
                    value={url}
                    className='px-4 py-2 focus:outline-purple-600 rounded-md'
                    placeholder='Enter your URL'
                    onChange={e => { seturl(e.target.value) }} />

                <input type="text"
                    value={shorturl}
                    className='px-4 py-2 focus:outline-purple-600 rounded-md'
                    placeholder='Enter your preferred short URL text'
                    onChange={e => { setshorturl(e.target.value) }} />
                <button onClick={generate} className='bg-purple-500 rounded-lg shadow-lg p-3 py-1 my-3 font-bold text-white'>Generate</button>
            </div>

            {generated && (
                <>
                    <span className='font-bold text-lg'>Your Link </span>
                    <code><Link target="_blank" href={`/${generated}`}>{generated}</Link></code>

                    <div className="flex gap-4 mt-4">
                        <button onClick={() => editShortUrl(shorturl)} className="cursor-pointer mx-1">
                            Edit
                        </button>
                        <button onClick={() => deleteShortUrl(shorturl)} className="cursor-pointer mx-1">
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Shorten
