import { useState, useEffect } from "react";

export default function POSApp() {
    const [code, setCode] = useState("");
    const [product, setProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
        throw new Error("環境変数 NEXT_PUBLIC_API_URL が設定されていません");
    }

    const fetchProduct = async () => {
        try {
            const res = await fetch(`${API_URL}/product/${code}`, { method: "GET" });
            
            if (!res.ok) {
                if (res.status === 404) {
                throw new Error("商品が見つかりません");
            }
            throw new Error(`エラーが発生しました: ${res.status}`);
        }
            const data = await res.json(); 
            setProduct(data.product);
        } catch (error) {
            console.error("APIエラー:", error);
        alert("商品情報の取得に失敗しました。ネットワーク接続を確認してください。");
    }
};

    const addToCart = () => {
        if (product) {
            setCart((prevCart) => {
                const updatedCart = [...prevCart, { ...product, quantity: 1 }];
                setTotal(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
                return updatedCart;
            });
            setProduct(null);
            setCode("");
        }
    };

    const updateQuantity = (index, newQuantity) => {
        setCart((prevCart) => {
            const updatedCart = [...prevCart];
            updatedCart[index].quantity = newQuantity;
            setTotal(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
            return updatedCart;
        });
    };

    const removeFromCart = (index) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter((_, i) => i !== index);
            setTotal(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
            return updatedCart;
        });
    };

    const handlePurchase = async () => {
        try {
            const purchaseData = {
                items: cart.map(item => ({
                    code: item.code,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                emp_cd: "9999999999" // レジ担当者コード（デフォルト）
            };
    
            console.log("送信データ:", JSON.stringify(purchaseData, null, 2));
    
            const res = await fetch(`${API_URL}/purchase`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(purchaseData),
            });
    
            if (!res.ok) {
                throw new Error(`購入処理に失敗しました (HTTP ${res.status})`);
            }
    
            const data = await res.json();
            alert(`購入完了: 取引ID: ${data.trd_id}, 合計金額: ${data.total_amt}円`);
            setCart([]);
            setTotal(0);
        } catch (error) {
            alert(error.message);
        }
    };
    

    return (
        <div>
            <h1>POSアプリ</h1>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="商品コードを入力" />
            <button onClick={fetchProduct}>商品コード 読み込み</button>

            {product && (
                <div>
                    <p>名称: {product.name}</p>
                    <p>単価: {product.price}円</p>
                    <button onClick={addToCart}>カートに追加</button>
                </div>
            )}

            <h2>購入リスト</h2>
            <ul>
                {cart.map((item, index) => (
                    <li key={index}>
                        {item.name} {item.price}円 × {item.quantity} = {item.price * item.quantity}円
                        <button onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
                        <button onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}>-</button>
                        <button onClick={() => removeFromCart(index)}>削除</button>
                    </li>
                ))}
            </ul>
            <p>合計金額: {total}円</p>
            <button onClick={handlePurchase} disabled={cart.length === 0}>購入する</button>
        </div>
    );
}
