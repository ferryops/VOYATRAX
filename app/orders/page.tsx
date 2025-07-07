"use client";
import { useEffect, useState } from "react";
import { fetchOrderHistory } from "@/app/(actions)/orderActions";
import { createClient } from "@/utils/supabase/client";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

export default function UserOrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (data.user) {
          setUserId(data.user.id);
        }
      });
  }, []);

  useEffect(() => {
    if (userId) {
      fetchOrderHistory(userId).then(({ data, error }) => {
        if (error) setError(error.message);
        else setOrders(data || []);
      });
    }
  }, [userId]);

  // PDF COMPONENT
  const TicketPDF = ({ order }: { order: any }) => (
    <Document>
      <Page size="A6" style={styles.body}>
        <Text style={styles.title}>Tiket Elektronik</Text>
        <Text>Order ID: {order.id}</Text>
        <Text>Tanggal: {order.order_date?.slice(0, 10)}</Text>
        <View style={styles.section}>
          {order.order_items.map((item: any) => (
            <View key={item.id} style={styles.item}>
              <Text>
                {item.ticket.origin} - {item.ticket.destination} (
                {item.ticket.date} {item.ticket.departure_time})
              </Text>
              <Text>Jumlah: {item.quantity}</Text>
              <Text>Harga: Rp {item.price}</Text>
            </View>
          ))}
        </View>
        {order.vouchers && (
          <View style={styles.section}>
            <Text>
              Voucher: {order.vouchers.code} ({order.vouchers.discount_type}{" "}
              {order.vouchers.discount_value})
            </Text>
          </View>
        )}
        <Text>Total Bayar: Rp {order.total_price}</Text>
        <Text>Status: {order.status}</Text>
      </Page>
    </Document>
  );

  return (
    <div>
      <h2>Riwayat Order Tiket</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Tanggal</th>
            <th>Detail Tiket</th>
            <th>Voucher</th>
            <th>Total</th>
            <th>Status</th>
            <th>Export PDF</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.order_date?.slice(0, 10)}</td>
              <td>
                {order.order_items.map((item: any) => (
                  <div key={item.id}>
                    {item.ticket.origin} - {item.ticket.destination} (
                    {item.ticket.date} {item.ticket.departure_time})<br />
                    Jumlah: {item.quantity} @Rp{item.price}
                  </div>
                ))}
              </td>
              <td>
                {order.vouchers ? (
                  <span>
                    {order.vouchers.code} ({order.vouchers.discount_type}{" "}
                    {order.vouchers.discount_value})
                  </span>
                ) : (
                  "-"
                )}
              </td>
              <td>Rp {order.total_price}</td>
              <td>{order.status}</td>
              <td>
                <PDFDownloadLink
                  document={<TicketPDF order={order} />}
                  fileName={`tiket_${order.id}.pdf`}
                  style={{ color: "blue" }}
                >
                  Download
                </PDFDownloadLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <div>Tidak ada order tiket.</div>}
    </div>
  );
}

// Simple style untuk PDF
const styles = StyleSheet.create({
  body: { padding: 10, fontSize: 10 },
  title: { fontSize: 16, textAlign: "center", marginBottom: 10 },
  section: { marginVertical: 5 },
  item: { marginBottom: 5 },
});
