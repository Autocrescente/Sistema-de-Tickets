process.env.NODE_ENV           = 'test';
process.env.JWT_SECRET         = 'test-secret-for-jest';
process.env.PORT               = '5001';
process.env.UPLOAD_MAX_SIZE_MB = '10';
process.env.UPLOAD_MAX_FILES   = '5';
// EMAIL_HOST propositadamente vazio — emailService detecta e não envia emails nos testes
