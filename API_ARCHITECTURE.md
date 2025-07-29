# API Architecture Documentation

## Overview

The Adaptive Learning Blockchain system consists of a Node.js backend (port 3000) and a React frontend (port 3001). The backend provides RESTful APIs for blockchain operations, mining, validators, discoveries, and real-time data.

## Backend Architecture

### Server Configuration
- **Port**: 3000
- **Framework**: Express.js
- **CORS**: Enabled for cross-origin requests
- **Security**: CSP headers, rate limiting, input validation

### Core Components

#### 1. Blockchain Management
- **Block Height Tracking**: Real-time block height updates
- **Block Validation**: Cryptographic validation of mined blocks
- **State Management**: Persistent blockchain state

#### 2. Mining System
- **Mathematical Work**: Prime pattern discovery, Riemann zeta computations
- **Difficulty Adjustment**: Adaptive difficulty based on network conditions
- **Reward Distribution**: Token distribution for successful mining

#### 3. Validator Network
- **Stake Management**: Validator stakes and rewards
- **Consensus**: Multi-validator consensus mechanism
- **Performance Tracking**: Validator uptime and reliability metrics

#### 4. Discovery System
- **Mathematical Discoveries**: Automated discovery of mathematical patterns
- **Optimization**: Machine learning optimization of discoveries
- **Repository**: Centralized discovery storage and management

## API Endpoints

### Core Blockchain APIs

#### `/api/status`
- **Method**: GET
- **Purpose**: Get current blockchain status
- **Response**: Block height, total rewards, mining status
- **Frontend Usage**: Main dashboard, block explorer

#### `/api/blocks`
- **Method**: GET
- **Purpose**: Get latest blocks data
- **Response**: Array of recent blocks with details
- **Frontend Usage**: Block explorer tab

#### `/api/blockchain/height`
- **Method**: GET
- **Purpose**: Get current block height
- **Response**: Current block height number
- **Frontend Usage**: Real-time block height display

#### `/api/blockchain/status`
- **Method**: GET
- **Purpose**: Get detailed blockchain status
- **Response**: Comprehensive blockchain state
- **Frontend Usage**: Network statistics

### Mining APIs

#### `/api/mining/status`
- **Method**: GET
- **Purpose**: Get mining operation status
- **Response**: Mining status, active workers, difficulty
- **Frontend Usage**: Mining tab

#### `/api/mining/mine`
- **Method**: POST
- **Purpose**: Submit mining work
- **Body**: workType, difficulty, quantumSecurity
- **Response**: Mining result, block details
- **Frontend Usage**: Mining operations

### Validator APIs

#### `/api/validators`
- **Method**: GET
- **Purpose**: Get validator network status
- **Response**: Validator list, stakes, performance
- **Frontend Usage**: Validators tab

#### `/api/staking/deposit`
- **Method**: POST
- **Purpose**: Stake tokens as validator
- **Body**: amount, validatorId
- **Response**: Staking confirmation
- **Frontend Usage**: Staking operations

### Discovery APIs

#### `/api/discoveries`
- **Method**: GET
- **Purpose**: Get mathematical discoveries
- **Response**: Discovery list with details
- **Frontend Usage**: Discoveries tab

#### `/api/discoveries/:id/test`
- **Method**: POST
- **Purpose**: Test discovery implementation
- **Body**: test parameters
- **Response**: Test results
- **Frontend Usage**: Discovery testing

### Trading APIs

#### `/api/trading`
- **Method**: GET
- **Purpose**: Get trading data
- **Response**: Market data, price feeds
- **Frontend Usage**: Exchange tab

#### `/api/orderbook`
- **Method**: GET
- **Purpose**: Get order book data
- **Response**: Buy/sell orders
- **Frontend Usage**: Trading interface

#### `/api/trades`
- **Method**: GET
- **Purpose**: Get recent trades
- **Response**: Trade history
- **Frontend Usage**: Trade history display

### Analytics APIs

#### `/api/network-stats`
- **Method**: GET
- **Purpose**: Get network statistics
- **Response**: Network metrics, performance data
- **Frontend Usage**: Analytics dashboard

#### `/api/learning/analytics`
- **Method**: GET
- **Purpose**: Get learning system analytics
- **Response**: ML model performance, optimization data
- **Frontend Usage**: Research repository

### Balance & Account APIs

#### `/api/balance`
- **Method**: GET
- **Purpose**: Get user balance
- **Response**: Token balances (MINED, USD, etc.)
- **Frontend Usage**: Wallet tab

#### `/api/accounts`
- **Method**: GET
- **Purpose**: Get account information
- **Response**: Account details, transaction history
- **Frontend Usage**: Account management

## Frontend-Backend Communication

### Data Flow

1. **Initial Load**
   - Frontend loads on port 3001
   - Makes API calls to backend on port 3000
   - Fetches initial data (status, blocks, validators)

2. **Real-time Updates**
   - Frontend polls APIs every 5 seconds
   - Updates state with new data
   - Re-renders components with fresh data

3. **User Interactions**
   - Mining operations trigger POST requests
   - Staking operations update validator state
   - Trading operations update market data

### State Management

#### Frontend State
- **blockchainData**: Current blockchain status
- **blocksData**: Latest blocks information
- **validatorsData**: Validator network data
- **discoveriesData**: Mathematical discoveries
- **tradingData**: Market and trading data

#### Backend State
- **blockHeight**: Current block height (30)
- **totalRewards**: Accumulated mining rewards
- **miningStatus**: Active/inactive mining state
- **validatorStakes**: Validator stake amounts
- **discoveries**: Mathematical discovery repository

### Error Handling

#### Network Errors
- Frontend shows fallback data when APIs are unavailable
- Retry mechanisms for failed requests
- Graceful degradation of functionality

#### Data Validation
- Backend validates all incoming requests
- Frontend validates API responses
- Type checking for critical data structures

## Current Issues & Solutions

### Issue 1: Frontend Showing 27 Blocks vs Backend 30
**Root Cause**: Frontend state not updating with latest backend data
**Solution**: 
- Fixed state initialization from `null` to `{ latestBlocks: [] }`
- Added debugging to track API calls and state updates
- Implemented manual refresh buttons for testing

### Issue 2: Block Explorer Only Showing Genesis Block
**Root Cause**: Fallback logic triggering when real data is available
**Solution**:
- Fixed API URL configuration (3000 instead of 3002)
- Added comprehensive debugging
- Improved state management

### Issue 3: API Communication Issues
**Root Cause**: CORS and network configuration
**Solution**:
- Verified CORS headers are properly set
- Confirmed all endpoints are accessible
- Added error handling for network issues

## Performance Considerations

### Caching Strategy
- Frontend caches API responses for 5 seconds
- Backend implements response caching for static data
- Real-time data bypasses cache

### Rate Limiting
- API endpoints have rate limiting
- Mining operations have cooldown periods
- Validator operations have stake-based limits

### Scalability
- Horizontal scaling support for multiple backend instances
- Database connection pooling
- Async/await for non-blocking operations

## Security Measures

### Input Validation
- All API inputs are validated
- SQL injection prevention
- XSS protection in responses

### Authentication
- API key validation for sensitive operations
- Rate limiting per user/IP
- Request signing for critical operations

### Data Protection
- Sensitive data encryption
- Secure communication protocols
- Audit logging for all operations

## Monitoring & Debugging

### Health Checks
- `/api/health` endpoint for system status
- Automated monitoring of all endpoints
- Performance metrics collection

### Debug Tools
- Console logging for API calls
- State inspection tools in frontend
- Manual refresh buttons for testing

### Error Tracking
- Comprehensive error logging
- User-friendly error messages
- Fallback mechanisms for failed requests

## Future Enhancements

### Planned Improvements
1. **WebSocket Integration**: Real-time updates instead of polling
2. **GraphQL API**: More efficient data fetching
3. **Microservices Architecture**: Service separation for scalability
4. **Enhanced Security**: JWT tokens, OAuth integration
5. **Performance Optimization**: Response compression, CDN integration

### API Versioning
- Version control for API endpoints
- Backward compatibility maintenance
- Deprecation policies for old endpoints

## Conclusion

The API architecture provides a robust foundation for the Adaptive Learning Blockchain system. The current implementation supports all core functionality while maintaining security and performance standards. Ongoing improvements focus on real-time communication, scalability, and enhanced user experience. 