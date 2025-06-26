'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const [clickData, setClickData] = useState(null);
    const [urls, setUrls] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const res1 = await fetch('/api/admin/analytics');
                const res2 = await fetch('/api/admin/urls');

                const analytics = await res1.json();
                const urlsData = await res2.json();

                setClickData(analytics);
                setUrls(urlsData);
            } catch (err) {
                console.error("❌ Error loading dashboard data:", err);
                setError('Failed to load data. Please check server logs.');
            }
        }

        load();
    }, []);

    if (error) {
        return <div className="p-6 text-red-600 font-medium">{error}</div>;
    }

    if (!clickData || !urls) {
        return <div className="p-6 text-gray-500">Loading dashboard...</div>;
    }

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Click Analytics Chart */}
            <Card className="col-span-2">
                <CardContent className="p-4">
                    <h2 className="text-xl font-bold mb-4">Click Analytics</h2>
                    {clickData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={clickData}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="clicks" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-sm text-gray-500">No analytics data available.</p>
                    )}
                </CardContent>
            </Card>

            {/* URL Monitoring Table */}
            <Card className="col-span-2">
                <CardContent className="p-4">
                    <h2 className="text-xl font-bold mb-4">URL Monitoring</h2>
                    {urls.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Short URL</TableHead>
                                    <TableHead>Original URL</TableHead>
                                    <TableHead>Clicks</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {urls.map((url, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{url.shortUrl}</TableCell>
                                        <TableCell className="truncate max-w-xs">{url.originalUrl}</TableCell>
                                        <TableCell>{url.clicks}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${url.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}>
                                                {url.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-sm text-gray-500">No URLs found.</p>
                    )}
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
                <CardContent className="p-4 flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Actions</h2>
                    <Button>Add New URL</Button>
                    <Button variant="outline">Export Click Logs</Button>
                </CardContent>
            </Card>
        </div>
    );
}
