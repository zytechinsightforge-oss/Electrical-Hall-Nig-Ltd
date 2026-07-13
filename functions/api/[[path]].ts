interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const path = params.path as string[];
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Helper to send JSON responses
    const json = (data: any, status = 200) => 
      new Response(JSON.stringify(data), { 
        status, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });

    // Company Settings
    if (path[0] === 'settings') {
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM company_settings LIMIT 1').all();
        if (results.length > 0) {
          const settings = results[0] as any;
          return json({
            name: settings.name,
            address: settings.address,
            phone: settings.phone,
            email: settings.email,
            rcNumber: settings.rc_number,
            motto: settings.motto,
            logo: settings.logo,
          });
        }
      } else if (request.method === 'PUT') {
        const newSettings = await request.json() as any;
        await env.DB.prepare(
          'UPDATE company_settings SET name = ?, address = ?, phone = ?, email = ?, rc_number = ?, motto = ?, logo = ? WHERE id = 1'
        ).bind(
          newSettings.name,
          newSettings.address,
          newSettings.phone,
          newSettings.email,
          newSettings.rcNumber,
          newSettings.motto,
          newSettings.logo
        ).run();
        return json({ success: true });
      }
    }

    // Users
    if (path[0] === 'users') {
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM users').all();
        return json(results);
      } else if (request.method === 'POST') {
        const user = await request.json() as any;
        await env.DB.prepare(
          'INSERT INTO users (id, username, name, role, active) VALUES (?, ?, ?, ?, ?)'
        ).bind(user.id, user.username, user.name, user.role, user.active ? 1 : 0).run();
        return json({ success: true });
      } else if (request.method === 'PUT') {
        const user = await request.json() as any;
        await env.DB.prepare(
          'UPDATE users SET username = ?, name = ?, role = ?, active = ? WHERE id = ?'
        ).bind(user.username, user.name, user.role, user.active ? 1 : 0, user.id).run();
        return json({ success: true });
      } else if (request.method === 'DELETE') {
        const id = path[1];
        await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
        return json({ success: true });
      }
    }

    // Categories
    if (path[0] === 'categories') {
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM categories').all();
        return json(results);
      } else if (request.method === 'POST') {
        const category = await request.json() as any;
        await env.DB.prepare(
          'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)'
        ).bind(category.id, category.name, category.description).run();
        return json({ success: true });
      } else if (request.method === 'PUT') {
        const category = await request.json() as any;
        await env.DB.prepare(
          'UPDATE categories SET name = ?, description = ? WHERE id = ?'
        ).bind(category.name, category.description, category.id).run();
        return json({ success: true });
      } else if (request.method === 'DELETE') {
        const id = path[1];
        await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
        return json({ success: true });
      }
    }

    // Products
    if (path[0] === 'products') {
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM products').all();
        const products = results.map((p: any) => ({
          ...p,
          supplierId: p.supplier_id,
          expiryDate: p.expiry_date,
          binLocation: p.bin_location
        }));
        return json(products);
      } else if (request.method === 'POST') {
        const product = await request.json() as any;
        await env.DB.prepare(
          'INSERT INTO products (id, name, unit, price, quantity, category, sku, supplier_id, expiry_date, bin_location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(
          product.id,
          product.name,
          product.unit,
          product.price,
          product.quantity,
          product.category,
          product.sku,
          product.supplierId,
          product.expiryDate,
          product.binLocation
        ).run();
        return json({ success: true });
      } else if (request.method === 'PUT') {
        const product = await request.json() as any;
        await env.DB.prepare(
          'UPDATE products SET name = ?, unit = ?, price = ?, quantity = ?, category = ?, sku = ?, supplier_id = ?, expiry_date = ?, bin_location = ? WHERE id = ?'
        ).bind(
          product.name,
          product.unit,
          product.price,
          product.quantity,
          product.category,
          product.sku,
          product.supplierId,
          product.expiryDate,
          product.binLocation,
          product.id
        ).run();
        return json({ success: true });
      } else if (request.method === 'DELETE') {
        const id = path[1];
        await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
        return json({ success: true });
      }
    }

    // Suppliers
    if (path[0] === 'suppliers') {
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM suppliers').all();
        return json(results);
      } else if (request.method === 'POST') {
        const supplier = await request.json() as any;
        await env.DB.prepare(
          'INSERT INTO suppliers (id, name, phone, email, address, company_name) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(
          supplier.id,
          supplier.name,
          supplier.phone,
          supplier.email,
          supplier.address,
          supplier.companyName
        ).run();
        return json({ success: true });
      } else if (request.method === 'PUT') {
        const supplier = await request.json() as any;
        await env.DB.prepare(
          'UPDATE suppliers SET name = ?, phone = ?, email = ?, address = ?, company_name = ? WHERE id = ?'
        ).bind(
          supplier.name,
          supplier.phone,
          supplier.email,
          supplier.address,
          supplier.companyName,
          supplier.id
        ).run();
        return json({ success: true });
      } else if (request.method === 'DELETE') {
        const id = path[1];
        await env.DB.prepare('DELETE FROM suppliers WHERE id = ?').bind(id).run();
        return json({ success: true });
      }
    }

    // Transactions
    if (path[0] === 'transactions') {
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM transactions ORDER BY date DESC').all();
        const transactions = results.map((t: any) => ({
          ...t,
          items: JSON.parse(t.items),
          customerName: t.customer_name,
          paymentMethod: t.payment_method,
          cashierName: t.cashier_name,
          costCenter: t.cost_center
        }));
        return json(transactions);
      } else if (request.method === 'POST') {
        const transaction = await request.json() as any;
        await env.DB.prepare(
          'INSERT INTO transactions (id, date, customer_name, items, total, payment_method, cashier_name, cost_center, branch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(
          transaction.id,
          transaction.date,
          transaction.customerName,
          JSON.stringify(transaction.items),
          transaction.total,
          transaction.paymentMethod,
          transaction.cashierName,
          transaction.costCenter,
          transaction.branch
        ).run();
        return json({ success: true });
      }
    }

    // Cost Centers
    if (path[0] === 'cost-centers') {
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM cost_centers').all();
        return json(results);
      } else if (request.method === 'POST') {
        const cc = await request.json() as any;
        await env.DB.prepare(
          'INSERT INTO cost_centers (id, name, code, branch) VALUES (?, ?, ?, ?)'
        ).bind(cc.id, cc.name, cc.code, cc.branch).run();
        return json({ success: true });
      } else if (request.method === 'PUT') {
        const cc = await request.json() as any;
        await env.DB.prepare(
          'UPDATE cost_centers SET name = ?, code = ?, branch = ? WHERE id = ?'
        ).bind(cc.name, cc.code, cc.branch, cc.id).run();
        return json({ success: true });
      } else if (request.method === 'DELETE') {
        const id = path[1];
        await env.DB.prepare('DELETE FROM cost_centers WHERE id = ?').bind(id).run();
        return json({ success: true });
      }
    }

    // Supplier Transactions
    if (path[0] === 'supplier-transactions') {
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM supplier_transactions ORDER BY date DESC').all();
        const transactions = results.map((t: any) => ({
          ...t,
          supplierId: t.supplier_id,
          supplierName: t.supplier_name,
          invoiceNumber: t.invoice_number
        }));
        return json(transactions);
      } else if (request.method === 'POST') {
        const transaction = await request.json() as any;
        await env.DB.prepare(
          'INSERT INTO supplier_transactions (id, supplier_id, supplier_name, date, amount, type, description, invoice_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(
          transaction.id,
          transaction.supplierId,
          transaction.supplierName,
          transaction.date,
          transaction.amount,
          transaction.type,
          transaction.description,
          transaction.invoiceNumber
        ).run();
        return json({ success: true });
      } else if (request.method === 'DELETE') {
        const id = path[1];
        await env.DB.prepare('DELETE FROM supplier_transactions WHERE id = ?').bind(id).run();
        return json({ success: true });
      }
    }

    // Procurement Orders
    if (path[0] === 'procurement-orders') {
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM procurement_orders ORDER BY date DESC').all();
        const orders = results.map((o: any) => ({
          ...o,
          invoiceNumber: o.invoice_number,
          supplierId: o.supplier_id,
          supplierName: o.supplier_name,
          items: JSON.parse(o.items),
          totalAmount: o.total_amount,
          amountPaid: o.amount_paid
        }));
        return json(orders);
      } else if (request.method === 'POST') {
        const order = await request.json() as any;
        await env.DB.prepare(
          'INSERT INTO procurement_orders (id, invoice_number, supplier_id, supplier_name, date, items, total_amount, amount_paid, status, branch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(
          order.id,
          order.invoiceNumber,
          order.supplierId,
          order.supplierName,
          order.date,
          JSON.stringify(order.items),
          order.totalAmount,
          order.amountPaid,
          order.status,
          order.branch
        ).run();
        return json({ success: true });
      } else if (request.method === 'PUT') {
        const order = await request.json() as any;
        await env.DB.prepare(
          'UPDATE procurement_orders SET invoice_number = ?, supplier_id = ?, supplier_name = ?, date = ?, items = ?, total_amount = ?, amount_paid = ?, status = ?, branch = ? WHERE id = ?'
        ).bind(
          order.invoiceNumber,
          order.supplierId,
          order.supplierName,
          order.date,
          JSON.stringify(order.items),
          order.totalAmount,
          order.amountPaid,
          order.status,
          order.branch,
          order.id
        ).run();
        return json({ success: true });
      }
    }

    // Subscriptions
    if (path[0] === 'subscriptions') {
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM subscriptions').all();
        return json(results);
      } else if (request.method === 'PUT') {
        const sub = await request.json() as any;
        await env.DB.prepare(
          'UPDATE subscriptions SET plan_name = ?, status = ?, amount = ?, expiry_date = ? WHERE id = ?'
        ).bind(sub.planName, sub.status, sub.amount, sub.expiryDate, sub.id).run();
        return json({ success: true });
      }
    }

    // Units
    if (path[0] === 'units') {
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT name FROM units').all();
        return json(results.map((u: any) => u.name));
      } else if (request.method === 'POST') {
        const data = await request.json() as any;
        await env.DB.prepare('INSERT INTO units (name) VALUES (?)').bind(data.name).run();
        return json({ success: true });
      } else if (request.method === 'DELETE') {
        const name = path[1];
        await env.DB.prepare('DELETE FROM units WHERE name = ?').bind(name).run();
        return json({ success: true });
      }
    }

    // Payment Methods
    if (path[0] === 'payment-methods') {
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT name FROM payment_methods').all();
        return json(results.map((p: any) => p.name));
      } else if (request.method === 'POST') {
        const data = await request.json() as any;
        await env.DB.prepare('INSERT INTO payment_methods (name) VALUES (?)').bind(data.name).run();
        return json({ success: true });
      } else if (request.method === 'DELETE') {
        const name = path[1];
        await env.DB.prepare('DELETE FROM payment_methods WHERE name = ?').bind(name).run();
        return json({ success: true });
      }
    }

    // Branches
    if (path[0] === 'branches') {
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT name FROM branches').all();
        return json(results.map((b: any) => b.name));
      } else if (request.method === 'POST') {
        const data = await request.json() as any;
        await env.DB.prepare('INSERT INTO branches (name) VALUES (?)').bind(data.name).run();
        return json({ success: true });
      } else if (request.method === 'DELETE') {
        const name = path[1];
        await env.DB.prepare('DELETE FROM branches WHERE name = ?').bind(name).run();
        return json({ success: true });
      }
    }

    return json({ error: 'Not found' }, 404);

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
};
