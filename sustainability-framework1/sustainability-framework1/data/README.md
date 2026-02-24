# Data Structure Documentation

This folder contains JSON files with structured data for the Building Sustainability Framework calculator.

## Files Overview

### `scenarios.json`
Defines the three main intervention scenarios:
- **Light Renovation**: 90% reuse, 15% embodied factor, 25% operational improvement
- **Deep Renovation**: 50% reuse, 50% embodied factor, 50% operational improvement
- **New Build**: 10% reuse, 150% embodied factor, 70% operational improvement

### `materials.json`
Material-specific embodied carbon factors:
- Concrete: 1.0 (baseline)
- Steel: 1.3 (highest)
- Timber: 0.7 (lowest)
- Masonry: 0.9
- Mixed: 1.0

### `climate.json`
Climate zone operational energy multipliers:
- Cold: 1.2 (heating-dominated)
- Temperate: 1.0 (baseline)
- Warm: 0.9 (cooling-dominated)
- Hot: 1.1 (extreme cooling)

### `test-cases.json`
Sample building scenarios for validation testing.
- Currently contains 3 placeholder test cases
- **Status**: Awaiting Valentine's validation data (deadline: Feb 25)

## Data Integration Status

| File | Status | Notes |
|------|--------|-------|
| `scenarios.json` | ✅ Complete | Ready for use |
| `materials.json` | ✅ Complete | Ready for use |
| `climate.json` | ✅ Complete | Ready for use |
| `test-cases.json` | ⏳ Pending | Awaiting Valentine's test data |

## Next Steps

1. **Feb 25**: Receive methodology documentation from Valentine
2. **Feb 25-28**: Validate formulas against her test cases
3. **Mar 1-5**: Update `test-cases.json` with expected results
4. **Mar 6-10**: Run validation tests
5. **Mar 11-17**: Bug fixes and final adjustments

## Usage in Code

These JSON files can be loaded dynamically in future versions:

```javascript
// Example: Load scenarios
fetch('data/scenarios.json')
  .then(response => response.json())
  .then(data => {
    console.log(data['light-renovation']);
  });
