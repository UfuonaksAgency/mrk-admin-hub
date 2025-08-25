-- Add some additional consultation data to make charts more meaningful
INSERT INTO consultations (name, email, telegram, preferred_time, experience_level, purpose, status, payment_status, created_at)
VALUES 
-- Recent paid consultations for revenue chart
('Alex Chen', 'alex.chen@email.com', '@alextrader', 'weekday-evening', 'intermediate', 'Portfolio optimization and risk management strategies', 'pending', 'paid', NOW() - INTERVAL '1 day'),
('Sarah Johnson', 'sarah.j@email.com', '@sarahcrypto', 'weekend-morning', 'beginner', 'Introduction to cryptocurrency trading basics', 'pending', 'paid', NOW() - INTERVAL '2 days'),
('Michael Rodriguez', 'mike.rod@email.com', '@miketrader', 'weekday-morning', 'advanced', 'Advanced options trading strategies review', 'pending', 'paid', NOW() - INTERVAL '3 days'),
('Emma Wilson', 'emma.w@email.com', '@emmainvest', 'weekend-afternoon', 'intermediate', 'Stock market analysis and swing trading techniques', 'pending', 'paid', NOW() - INTERVAL '5 days'),
('David Kim', 'david.kim@email.com', '@davidfx', 'weekday-evening', 'advanced', 'Forex market analysis and currency pair strategies', 'pending', 'paid', NOW() - INTERVAL '7 days'),

-- Some pending consultations
('Jennifer Liu', 'jen.liu@email.com', '@jentrader', 'weekend-morning', 'beginner', 'Basic trading principles and platform setup', 'pending', 'pending', NOW() - INTERVAL '12 hours'),
('Robert Taylor', 'rob.taylor@email.com', '@robfx', 'weekday-afternoon', 'intermediate', 'Day trading strategies and technical analysis', 'pending', 'pending', NOW() - INTERVAL '6 hours'),

-- Some recent unpaid consultations
('Lisa Wang', 'lisa.wang@email.com', '@lisacrypto', 'weekend-evening', 'beginner', 'Cryptocurrency fundamentals and wallet security', 'pending', 'unpaid', NOW() - INTERVAL '1 day'),
('James Brown', 'james.b@email.com', '@jamesstock', 'weekday-morning', 'intermediate', 'Value investing and fundamental analysis', 'pending', 'unpaid', NOW() - INTERVAL '2 days'),
('Maria Garcia', 'maria.g@email.com', '@mariatrading', 'weekend-afternoon', 'advanced', 'Algorithmic trading and automation strategies', 'pending', 'unpaid', NOW() - INTERVAL '4 days');

-- Add some corresponding crypto payments for the paid consultations
INSERT INTO crypto_payments (consultation_id, amount_usd, amount_crypto, coin_type, status, payment_address, transaction_hash, created_at, payment_data)
SELECT 
    c.id,
    300.00,
    CASE 
        WHEN random() < 0.5 THEN 0.0075 + (random() * 0.001)
        ELSE 0.0071 + (random() * 0.001)
    END,
    CASE 
        WHEN random() < 0.7 THEN 'BTC'
        WHEN random() < 0.9 THEN 'ETH' 
        ELSE 'USDT'
    END,
    'completed',
    'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    md5(random()::text),
    c.created_at + INTERVAL '30 minutes',
    jsonb_build_object(
        'provider', 'nowpayments',
        'payment_method', 'crypto',
        'confirmation_count', floor(random() * 10) + 6
    )
FROM consultations c 
WHERE c.payment_status = 'paid' 
AND c.created_at > NOW() - INTERVAL '30 days'
AND NOT EXISTS (
    SELECT 1 FROM crypto_payments cp WHERE cp.consultation_id = c.id
);