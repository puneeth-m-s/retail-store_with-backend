-- Create the Products table
CREATE TABLE products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  category TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Create the Sales table
CREATE TABLE sales (
  sale_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  customer_name TEXT,
  payment_method TEXT DEFAULT 'cash'
);


-- Create the Customers table
CREATE TABLE Customers (
  customer_id SERIAL PRIMARY KEY,          -- Auto-incrementing unique ID for each customer
  first_name VARCHAR(100) NOT NULL,        -- Customer's first name, required
  last_name VARCHAR(100),                  -- Customer's last name, optional
  email VARCHAR(255) NOT NULL UNIQUE,      -- Customer's email, required and must be unique
  phone_number VARCHAR(15),                -- Customer's phone number, optional
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Automatically sets the creation time
);


-- Create the Orders table
CREATE TABLE Orders (
  order_id SERIAL PRIMARY KEY,                 -- Auto-incrementing unique ID for each order
  customer_id INT REFERENCES Customers(customer_id) ON DELETE CASCADE,  -- Reference to Customers table
  total_amount DECIMAL(10, 2) NOT NULL,        -- Total amount for the order
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Automatically set order date
);

-- Function to update the `updated_at` field on products table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Trigger to call the function before each update on products
CREATE TRIGGER update_product_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Step 1: Create the function to check stock level after a sale
CREATE OR REPLACE FUNCTION check_stock_level()
RETURNS TRIGGER AS $$
DECLARE
  current_stock INT;
BEGIN
  -- Get the current stock for the product
  SELECT stock INTO current_stock FROM products WHERE id = NEW.product_id;

  -- Check if stock is below 10
  IF current_stock < 10 THEN
    -- You can either RAISE a NOTICE (just a log message) or RAISE an EXCEPTION to stop the transaction
    RAISE NOTICE 'Warning: Stock for product % is low (% remaining)', NEW.product_id, current_stock;
  END IF;

  -- Continue with the transaction
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Create a trigger that runs after an insert on the sales table
CREATE TRIGGER stock_check_after_sale
AFTER INSERT ON sales
FOR EACH ROW
EXECUTE FUNCTION check_stock_level();


CREATE OR REPLACE FUNCTION reduce_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET stock = stock - NEW.quantity
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER reduce_stock_after_sale
AFTER INSERT ON sales
FOR EACH ROW
EXECUTE FUNCTION reduce_product_stock();



